const removeButtons = document.querySelectorAll(".btnRemove")
const allRemoveButton = document.querySelector(".btnAllRemove");

const DeletePosting = async (id) => {
    await fetch(`/user/attendance/check/${id}/delete`, {
        method: "POST",
    });
};

const handleRemoveAttendance = (event) => {
    const attendanceId = event.path[3].dataset.id;
    if(confirm("정말 삭제하시겠습니까?") == true){
        DeletePosting(attendanceId);
        location.reload();
    }
    else
        return;
};

const handleRemoveAllAttendance = async () => {
    if(confirm("모든 출석 기록을 삭제하시겠습니가?") == true){
        if(removeButtons.length != 0){
            let attendanceId;
            for (let i = 0; i < removeButtons.length; i++) {
                attendanceId = removeButtons[i].parentElement.parentElement.parentElement.dataset.id;
                await DeletePosting(attendanceId);
            }
            location.reload();
        }else{
            alert("출석 기록이 없습니다.")
            return;
        }
    }else{
        return;
    }
}

for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", handleRemoveAttendance);
}

allRemoveButton.addEventListener("click", handleRemoveAllAttendance);