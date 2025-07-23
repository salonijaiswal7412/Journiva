const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLocalDateString = (date) => {
  const d = new Date(date);
  return d.getFullYear() + '-' + 
         String(d.getMonth() + 1).padStart(2, '0') + '-' + 
         String(d.getDate()).padStart(2, '0');
};

const createJournal = async (req, res) => {
  try {
    const { title, content, mood, tags = [], isPrivate = false } = req.body;
    const userId = req.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - User ID not found" });
    }

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
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

const getMyJournals = async (req, res) => {
  const userId = req.userId || req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized - User ID not found" });
  }

  try {
    const journals = await prisma.journal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(journals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch journals" });
  }
};

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
};