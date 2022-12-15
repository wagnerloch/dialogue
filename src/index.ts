import * as readline from 'readline';
import * as smallTalk from './SmallTalks-Chats.json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const characters = smallTalk.characters;
const nodes = smallTalk.chats[0].nodes;

// Start of the dialog
printDialog(0);

function printDialog(index: number) {
  console.log(
    `${getCharacterName(nodes[index].character)}: ${nodes[index].message}`
  );

  if (nodes[index].goesTo.length > 1 && nodes[index].type === 'text') {
    // There is more than one option
    printOptions(nodes[index].goesTo);
    collectAnswer(nodes[index].goesTo);
  } else if (nodes[index].goesTo.length) {
    // Just following the flow
    printDialog(getNodeIndex(nodes[index].goesTo[0]));
  } else {
    // End of the conversation
    rl.close();
  }
}

function getCharacterName(id: string): string {
  let currentName = '';
  characters.forEach(character => {
    if (character.id === id) {
      currentName = character.name;
    }
  });
  return currentName;
}

function getNodeIndex(id: string): number {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return i;
    }
  }
  return -1;
}

function printOptions(options: Array<string>) {
  for (let i = 0; i < options.length; i++) {
    const currentNodeIndex = getNodeIndex(options[i]);
    console.log(`${i} - ${nodes[currentNodeIndex].message}`);
  }
  console.log('==============================');
}

function collectAnswer(options: Array<string>) {
  rl.question('What is your answer?   ', async answer => {
    for (let i = 0; i < options.length; i++) {
      if (answer === i.toString()) {
        printDialog(getNodeIndex(options[i]));
      }
    }
  });
}
