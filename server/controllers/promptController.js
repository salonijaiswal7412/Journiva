const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLocalDateString = (date) => {
  const d = new Date(date);
  return d.getFullYear() + '-' + 
         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
         String(d.getDate()).padStart(2, '0');
};

//Create Journal
const createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags = [], isPrivate = false, promptId } = req.body;
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" });
    }

    if (!title || !content || !mood) {
      return res.status(400).json({ message: "Title, content, and mood are required" });
    }

    const today = new Date();
    const todayDateString = getLocalDateString(today);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastEntryDateString = user.lastEntryDate ? getLocalDateString(user.lastEntryDate) : null;
    
    let newStreak = user.streak;
    let shouldUpdateStreak = false;

    console.log('Debug - Today:', todayDateString);
    console.log('Debug - Last Entry Date:', lastEntryDateString);
    console.log('Debug - Current Streak:', user.streak);

    if (!lastEntryDateString) {
      newStreak = 1;
      shouldUpdateStreak = true;
      console.log('Debug - First entry, streak = 1');
    } else if (lastEntryDateString !== todayDateString) {
      const todayDate = new Date(todayDateString);
      const lastDate = new Date(lastEntryDateString);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      console.log('Debug - Days difference:', daysDiff);
      
      if (daysDiff === 1) {
        newStreak = user.streak + 1;
        shouldUpdateStreak = true;
        console.log('Debug - Consecutive day, incrementing streak to:', newStreak);
      } else if (daysDiff > 1) {
        newStreak = 1;
        shouldUpdateStreak = true;
        console.log('Debug - Gap in days, resetting streak to 1');
      }
    } else {
      console.log('Debug - Same day, keeping streak at:', user.streak);
    }

    const newEntry = await prisma.journal.create({
      data: {
        title,
        content,
        mood,
        tags,
        isPrivate,
        userId,
        promptId: promptId || null,
      },
    });

    if (shouldUpdateStreak) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: newStreak,
          lastEntryDate: new Date(todayDateString),
        },
      });
    }

    res.status(201).json({ journal: newEntry, streak: newStreak });
  } catch (error) {
    console.error("Error creating journal:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Respond to Today's Prompt
const respondToPrompt = async (req, res) => {
  try {
    const { content, mood, tags = [], isPrivate = false } = req.body;
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" });
    }

    if (!content || !mood) {
      return res.status(400).json({ message: "Content and mood are required" });
    }

    // Get today's prompt
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPrompt = await prisma.prompt.findUnique({
      where: {
        promptDate: today,
      },
    });

    if (!todayPrompt) {
      return res.status(404).json({ message: "No prompt available for today" });
    }

    // Check if user has already responded to today's prompt
    const existingResponse = await prisma.journal.findFirst({
      where: {
        userId,
        promptId: todayPrompt.id,
      },
    });

    if (existingResponse) {
      return res.status(409).json({ 
        message: "You have already responded to today's prompt",
        existingEntry: existingResponse 
      });
    }

    const todayDateString = getLocalDateString(today);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastEntryDateString = user.lastEntryDate ? getLocalDateString(user.lastEntryDate) : null;
    
    let newStreak = user.streak;
    let shouldUpdateStreak = false;

    console.log('Debug - Today:', todayDateString);
    console.log('Debug - Last Entry Date:', lastEntryDateString);
    console.log('Debug - Current Streak:', user.streak);

    if (!lastEntryDateString) {
      newStreak = 1;
      shouldUpdateStreak = true;
      console.log('Debug - First entry, streak = 1');
    } else if (lastEntryDateString !== todayDateString) {
      const todayDate = new Date(todayDateString);
      const lastDate = new Date(lastEntryDateString);
      const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
      
      console.log('Debug - Days difference:', daysDiff);
      
      if (daysDiff === 1) {
        newStreak = user.streak + 1;
        shouldUpdateStreak = true;
        console.log('Debug - Consecutive day, incrementing streak to:', newStreak);
      } else if (daysDiff > 1) {
        newStreak = 1;
        shouldUpdateStreak = true;
        console.log('Debug - Gap in days, resetting streak to 1');
      }
    } else {
      console.log('Debug - Same day, keeping streak at:', user.streak);
    }

    // Create journal entry as response to prompt
    const promptResponse = await prisma.journal.create({
      data: {
        title: `Response to: ${todayPrompt.title}`,
        content,
        mood,
        tags,
        isPrivate,
        userId,
        promptId: todayPrompt.id,
      },
    });

    if (shouldUpdateStreak) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          streak: newStreak,
          lastEntryDate: new Date(todayDateString),
        },
      });
    }

    res.status(201).json({ 
      journal: promptResponse, 
      prompt: todayPrompt,
      streak: newStreak 
    });
  } catch (error) {
    console.error("Error responding to prompt:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get Today's Prompt
const getTodayPrompt = async (req, res) => {
  try {
    const userId = req.userId || req.user?.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const prompt = await prisma.prompt.findUnique({
      where: {
        promptDate: today,
      },
    });

    if (!prompt) {
      return res.status(404).json({ message: 'No prompt for today' });
    }

    // Check if user has already responded to this prompt
    let hasResponded = false;
    let userResponse = null;

    if (userId) {
      userResponse = await prisma.journal.findFirst({
        where: {
          userId,
          promptId: prompt.id,
        },
      });
      hasResponded = !!userResponse;
    }

    res.json({ 
      prompt, 
      hasResponded,
      userResponse 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Get All Journals for Logged-in User
const getMyJournals = async (req, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - User ID not found" });
  }

  try {
    const journals = await prisma.journal.findMany({
      where: { userId },
      include: {
        prompt: {
          select: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
};

//Update Journal Entry
const updateJournal = async (req, res) => {
  const journalId = req.params.id;
  const userId = req.userId || req.user?.id;
  const { title, content, mood, tags, isPrivate } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - User ID not found" });
  }

  try {
    const existing = await prisma.journal.findUnique({
      where: { id: journalId },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Journal not found or unauthorized" });
    }

    const updated = await prisma.journal.update({
      where: { id: journalId },
      data: {
        title,
        content,
        mood,
        tags,
        isPrivate,
      },
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update journal" });
  }
};

// Delete Journal Entry
const deleteJournal = async (req, res) => {
  const journalId = req.params.id;
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - User ID not found" });
  }

  try {
    const existing = await prisma.journal.findUnique({
      where: { id: journalId },
    });

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "Journal not found or unauthorized" });
    }

    await prisma.journal.delete({
      where: { id: journalId },
    });

    res.status(200).json({ message: "Journal deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete journal" });
  }
};

module.exports = {
  createJournal,
  getMyJournals,
  updateJournal,
  deleteJournal,
  respondToPrompt,
  getTodayPrompt,
};