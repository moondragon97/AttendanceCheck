const container = document.querySelector(".profileContainer")
const btnDelete = container.querySelector(".userDelete");
const userId = container.dataset.id;

const handleClickButton = async () => {
    if(confirm("정말 삭제 하시겠습니까?") == true){
        await fetch(`/user/${userId}/leave`, {
            method: "POST",
        })
        window.location.reload();
    }else{
        return;
    }
}

if(btnDelete)
    btnDelete.addEventListener("click", handleClickButton)