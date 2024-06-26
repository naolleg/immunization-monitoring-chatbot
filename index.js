const openai =require( './config/open-ai.js');
const readlineSync =require( 'readline-sync');
const colors =require('colors') ;

const filterKeywords =[
  // Greetings
  'hello', 'hi', 'hey', 'greetings', 'good', 'morning',
  'good', 'afternoon', 'good', 'evening', 'how', 'are',
  'you', 'what\'s', 'how\'s', 'it', 'going',
  
  // Child Immunization
  'child', 'vaccinations', 'vaccine', 'schedule', 'immunization',
  'shots', 'baby', 'vaccines', 'infant', 'immunization',
  'vaccination', 'for', 'kids', 'vaccine', 'for', 'babies',
  'immunization', 'for', 'children', 'vaccine', 'shots',
  'vaccine', 'recommendations', 'immunization', 'guidelines',
  'vaccine', 'side', 'effects', 'vaccine-preventable', 'diseases',
  'child', 'vaccine', 'safety', 'vaccine', 'coverage',
  'vaccine', 'information', 'vaccine', 'myths', 'immunization',
  'records', 'vaccine', 'exemptions', 'catch-up', 'immunization',
  'vaccine', 'education', 'school', 'immunization', 'requirements',
]; 

async function main() {
  console.log(colors.bold.green('Welcome to the Chatbot Program!'));
  console.log(colors.bold.green('You can start chatting with the bot.'));

  const chatHistory = []; // Store conversation history

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    try {
      let shouldRespond = false;
      for (const keyword of filterKeywords) {
        if (userInput.toLowerCase().includes(keyword)) {
          shouldRespond = true;
          break;
        }
      }

      if (!shouldRespond) {
        console.log(colors.green('Bot: ') + 'I only respond to child immunization and vaccine-related questions.');
        continue;
      }

      // Construct messages by iterating over the history
      const messages = chatHistory.map(([role, content]) => ({
        role,
        content,
      }));

      // Add latest user input
      messages.push({ role: 'user', content: userInput });

      // Call the API with user input & history
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      });

      // Get completion text/content
      const completionText = completion.data.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log(colors.green('Bot: ') + completionText);
        return;
      }

      console.log(colors.green('Bot: ') + completionText);

      // Update history with user input and assistant response
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', completionText]);
    } catch (error) {
      console.error(colors.red(error));
    }
  }
}

main();