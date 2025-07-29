const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const {addDays}=require('date-fns');

const sampleQuestions = [
  "What made you smile today?",
  "What is one thing you're grateful for?",
  "What challenge did you overcome recently?",
  "Describe your perfect day.",
  "What emotion did you feel most today?",
  "What’s something new you tried this week?",
  "How do you recharge after a long day?",
  "What’s a memory you cherish?",
  "What lesson did today teach you?",
  "Who or what inspires you most?",
  "What are you currently looking forward to?",
  "Write about someone who made a difference in your life.",
  "What does happiness mean to you?",
  "What’s something you’ve been avoiding?",
  "How do you deal with stress?",
  "What do you love most about yourself?",
  "What was the highlight of your week?",
  "If today had a theme, what would it be?",
  "How did you show kindness today?",
  "Describe a moment you felt proud recently.",
  "What helps you feel calm?",
  "If you could talk to your younger self, what would you say?",
  "What do you need to let go of?",
  "Describe a recent act of courage.",
  "What small win did you have today?",
  "What makes you feel alive?",
  "What limiting belief do you want to overcome?",
  "What’s something you’ve learned about yourself lately?",
  "What’s your favorite time of day and why?",
  "Write about a recent positive interaction.",
  "What’s one goal you’re working on?",
  "What are your top 3 values in life?",
  "What is something you want to create?",
  "How did you take care of yourself today?",
  "What motivates you to keep going?",
  "Describe your ideal morning routine.",
  "What’s your favorite way to relax?",
  "What brings you peace?",
  "What does success look like to you?",
  "What are you most passionate about?",
  "What fear would you like to conquer?",
  "How do you define love?",
  "What boundaries are you working on?",
  "What’s your favorite quote and why?",
  "What makes you feel fulfilled?",
  "How would your best friend describe you?",
  "Write about a dream you’ve had recently.",
  "What’s one thing you want to improve?",
  "What do you appreciate about today?",
  "Write about a book or movie that inspired you.",
  "What advice would you give yourself today?",
  "What are you learning to accept?",
  "Describe a time you felt truly seen.",
  "What does healing mean to you?",
  "What’s one habit you want to build?",
  "Write about a moment you felt connected to someone.",
  "What is something you’re proud of that no one knows?",
  "What’s your favorite memory from childhood?",
  "What do you need more of in your life?",
  "What are you most excited about right now?",
  "Who do you admire and why?",
  "What makes you feel grounded?",
  "What’s your favorite way to express yourself?",
  "What are you grateful your past self did?",
  "What does your ideal life look like?",
  "What gives your life meaning?",
  "Write about a personal breakthrough you've had.",
  "What area of your life needs more attention?",
  "What lesson did you learn the hard way?",
  "How do you want to grow this year?",
  "What’s something you want to forgive yourself for?",
  "What’s something you’ve done recently that scared you?",
  "What’s your favorite way to connect with others?",
  "How do you show love to others?",
  "What are you currently healing from?",
  "What would you do if you weren’t afraid?",
  "What’s one thing that’s helped your mental health?",
  "What song best describes your mood today?",
  "What’s something you miss?",
  "What does it mean to be authentic?",
  "What habit is no longer serving you?",
  "Describe your current season of life in three words.",
  "What does balance mean in your life?",
  "How has your perspective changed over time?",
  "What do you want more time for?",
  "Write a letter to your future self.",
  "What makes you unique?",
  "What are you most grateful for right now?",
  "How do you handle change?",
  "What’s a recent moment of joy you experienced?",
  "Who makes you feel safe?",
  "What legacy do you want to leave behind?",
  "What’s something you need to say out loud?",
  "Write about a moment you felt at peace.",
  "How do you protect your energy?",
  "What does rest look like for you?",
  "What are you letting go of today?",
  "What do you want to be remembered for?",
  "How do you speak to yourself in tough times?",
  "What’s something you're proud of today?",
  "What part of yourself are you learning to love?",
  "What intention do you want to set for tomorrow?",
  "Describe how you've changed in the past year.",
  "How do you feel in this very moment?"
];
async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 100; i++) {
    const promptDate = addDays(today, i);
    promptDate.setHours(0, 0, 0, 0);

    const question = sampleQuestions[i % sampleQuestions.length];

    await prisma.prompt.upsert({
      where: { promptDate: promptDate },
      update: { question }, // If exists, update question
      create: {
        promptDate: promptDate,
        question: question,
      },
    });
  }

  console.log("✅ 100 prompts seeded or updated successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });