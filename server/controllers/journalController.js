const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a journal
const createJournal = async (req, res) => {
  const userId = req.user.id;
  const { title, content, mood, tags, isPrivate = false } = req.body;

  try {
    const journal = await prisma.journal.create({
      data: {
        title,
        content,
        mood,
        tags,
        isPrivate,
        userId
      }
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create journal" });
  }
};

// Get all journals of the logged-in user
const getMyJournals = async (req, res) => {
  const userId = req.user.id;

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

// Update a journal
const updateJournal = async (req, res) => {
  const journalId = req.params.id;
  const userId = req.user.id;
  const { title, content, mood, tags, isPrivate } = req.body;

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

// Delete a journal
const deleteJournal = async (req, res) => {
  const journalId = req.params.id;
  const userId = req.user.id;

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
