let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];



const searchNotes=(word)=>{
  const searchWord=word.toLowerCase();
  return notes.filter(note=>
    note.text.toLowerCase().includes(searchWord)
  );

};

const longestNote=()=>{
  if(notes.length===0){
    return null;
  }
  return notes.reduce((longest,note)=> {
    return note.text.length> longest.text.length
    ? note
     :longest;
  })
};



const countByCategory=()=>{
  const counts={
    personal:0,
    work:0,
    study:0
  }
  notes.forEach(note=>{
    counts[note.category]++;
  });
  return counts;
};

const getSummary=()=>{
  const counts=countByCategory();
  return `${notes.length} notes: ${counts.personal}`
};

const isDuplicate=(text)=>{
  const cleanText=text.trim().replace(/\s+/g, " ").toLowerCase();
  return notes.some(note =>{
    const existingText=note.text.trim().replace(/\s+/g, " ").toLowerCase(); 

    return existingText===cleanText;
  });

};

const addNote=(text, category)=>{
  text=text.trim();

  if(text.length<1 || text.length>200){
    console.log("Note must be between 1 and 200 characters. ");
    return false;
  }

  const validCategories=['personal','work','study'];

  if(!validCategories.includes(category)){
    console.log("Invalid category. Use personal,work,or study.");
    return false;
  }

  if(isDuplicate(text)){
    console.log("This note already exists");
    return false;
  }

  const newId=notes.length>0
  ? Math.max(...notes.map(note=>note.id)) + 1
  : 1;
  notes.push({
    id:newId,
    text:text,
    category:category
  });
  console.log("Note added Successfully");
  return true;
};

console.log("Search");
console.log(searchNotes("day"));

console.log("Longest note");
console.log(longestNote());

console.log("Count by category");
console.log(countByCategory());

console.log("Summary");
console.log(getSummary());

console.log("Duplicate check");
console.log(isDuplicate("BUY MILK AND BREAD"));

console.log("Adding valid note");
console.log(addNote("Buy some vegeatables", "personal"));

console.log("Adding duplicate note");
console.log(addNote("Buy milk and bread", "personal"));

console.log("Adding invalid category:");
console.log(addNote("Going to the gym", "health"));

console.log("Final notes");
console.log(notes);