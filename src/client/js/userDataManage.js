const btnGrantManager = document.querySelectorAll(".btnGrantManager");
const btnRevokeManager = document.querySelectorAll(".btnRevokeManager");
const btnGrantAdmin = document.querySelectorAll(".btnGrantAdmin");
const btnUserDelete = document.querySelectorAll(".btnUserDelete");

const authControl = async (_id, _link, _text) => {
    if(confirm(_text) == true){
        await fetch(`/user/${_id}/${_link}`, {
            method: "POST"
        });
        window.location.reload();
    }else{
        return;
    }
}

const handleGrantManager = (event) => {
    userId = event.path[2].dataset.id;
    authControl(userId, "grant-manager", "총무 권한을 주시겠습니까?");
};

const handleRevokeManager = (event) => {
    userId = event.path[2].dataset.id;
    authControl(userId, "revoke-manager", "총무 권한을 없애겠습니까?");
}

const handleGrantAdmin = (event) => {
    userId = event.path[2].dataset.id;
    authControl(userId, "grant-admin", "관리자 권한을 주시겠습니까?\n당신의 권한은 사라집니다!");
}

const handleUserDelete = (event) => {
    userId = event.path[2].dataset.id;
    authControl(userId, "leave", "선택한 계정을 삭제하시겠습니까?");
}


for (let i = 0; i < btnGrantManager.length; i++) {
    btnGrantManager[i].addEventListener("click", handleGrantManager);
}

for (let i = 0; i < btnRevokeManager.length; i++) {
    btnRevokeManager[i].addEventListener("click", handleRevokeManager);
}

for (let i = 0; i < btnGrantAdmin.length; i++) {
    btnGrantAdmin[i].addEventListener("click", handleGrantAdmin);
}

for (let i = 0; i < btnUserDelete.length; i++) {
    btnUserDelete[i].addEventListener("click", handleUserDelete);
}