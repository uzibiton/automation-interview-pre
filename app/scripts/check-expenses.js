import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'skillful-eon-477917-b7',
});

async function checkExpenses() {
  console.log('Checking expenses in Firestore...\n');

  const snapshot = await db.collection('expenses').get();

  console.log(`Total expenses: ${snapshot.size}\n`);

  snapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`  Amount: ${data.amount} ${data.currency}`);
    console.log(`  Category: ${data.categoryId}`);
    console.log(`  Date: ${data.date}`);
    console.log(`  User: ${data.userId}`);
    console.log(`  Created: ${data.createdAt}\n`);
  });
}

checkExpenses().catch(console.error);
