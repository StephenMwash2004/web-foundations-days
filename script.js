const textarea=document.querySelector("#note-text");
const charCount=document.querySelector("#char-count");
const wordCount=document.querySelector("#word-count");
const clearBtn=document.querySelector("#clear-btn");
const toggleBtn=document.querySelector("#theme-toggle");


const updateCounts=()=>{

    const text=textarea.value;
    const chars=text.length;

    const words=text.trim()==="" ? 0 : text.trim().split(/\s+/).length;
    charCount.textContent=`${chars} /200 characters`;
    wordCount.textContent=`${words} words`;

    charCount.classList.remove("Warning","over");


    if(chars >180){
        charCount.classList.add("warning");
    }
    if(chars > 200){
        charCount.classList.remove("warning");
        charCount.classList.add("over");
    }

}


textarea.addEventListener("input",()=>{
    const draft=localStorage.getItem("draft");

    if(draft){
        textarea.value=draft;
    }
    const theme =localStorage.getItem("theme");

    if(theme==="dark"){
        document.body.classList.add("dark");
        themeBtn.textContent="Light Mode"
    }

    updateCounts();
})