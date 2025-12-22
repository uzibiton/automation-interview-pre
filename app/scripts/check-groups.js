import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'skillful-eon-477917-b7',
});

async function checkGroupsAndMembers() {
  console.log('Checking groups and members in Firestore...\n');

  // Check groups
  const groupsSnapshot = await db.collection('groups').get();
  console.log(`Total groups: ${groupsSnapshot.size}\n`);

  groupsSnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`Group ID: ${doc.id}`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Description: ${data.description}`);
    console.log(`  Created By: ${data.createdBy}`);
    console.log(`  Member Count: ${data.memberCount}\n`);
  });

  // Check members
  const membersSnapshot = await db.collection('group_members').get();
  console.log(`Total group members: ${membersSnapshot.size}\n`);

  membersSnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`Member ID: ${doc.id}`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Email: ${data.email}`);
    console.log(`  Role: ${data.role}`);
    console.log(`  Group ID: ${data.groupId}\n`);
  });

  // Check test user expenses
  console.log('Expenses for test-user-001:');
  const expensesSnapshot = await db
    .collection('expenses')
    .where('userId', '==', 'test-user-001')
    .get();
  console.log(`Total expenses: ${expensesSnapshot.size}`);
}

checkGroupsAndMembers().catch(console.error);
