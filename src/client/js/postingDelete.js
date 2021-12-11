const btnDeletePosting = document.querySelector(".deletePosting");
const postingId = btnDeletePosting.dataset.id;

const handleDeletePosting = async () => {
    if(confirm("정말 삭제하시겠습니까?") == true){
        await fetch(`/board/${postingId}/remove`, {
            method: "POST"
        });
        window.open("/board");
    }else{
        return;
    }
}


btnDeletePosting.addEventListener("click", handleDeletePosting);