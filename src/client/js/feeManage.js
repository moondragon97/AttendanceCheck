const btnSubmitFees = document.querySelectorAll(".btnSubmitFee");
const plusFees = document.querySelectorAll(".plusFee");
const minusFees = document.querySelectorAll(".minusFee");
const btnSubmitAll = document.querySelector(".btnSubmitAll");
const totalPenalty = document.querySelector(".totalPenalty");
const inputTotalPenalty = document.querySelector(".inputTotalPenalty");
const btnTotalPenalty = document.querySelector(".btnTotalPenalty");

const handleSubmitFeeClick = (event) => {
    event.preventDefault();
    const user = event.path[2];
    SubmitFee(user);
};

const SubmitFee = async (user) => {
    const feeData = user.querySelector(".currentFee");
    const penaltyData = user.querySelector(".currentPenalty");
    const plusPenalty = user.querySelector(".plusPenalty");
    const minusPenalty = user.querySelector(".minusPenalty");
    const submitPenalty = user.querySelector(".submitPenalty");
    const submitFeeInput = user.querySelector(".submitFee");
    
    let submitFeeValue = parseInt(submitFeeInput.value);
    let plusValue = parseInt(plusPenalty.value);
    let minusValue = parseInt(minusPenalty.value);
    let submitPenaltyValue = parseInt(submitPenalty.value);
    let totalPenaltyValue = parseInt(totalPenalty.textContent);
    submitFeeValue = Number.isInteger(submitFeeValue) ? submitFeeValue : 0;
    plusValue = Number.isInteger(plusValue) ? plusValue : 0;
    minusValue = Number.isInteger(minusValue) ? minusValue : 0;
    submitPenaltyValue = Number.isInteger(submitPenaltyValue) ? submitPenaltyValue : 0;

    if(submitFeeValue % 5000 != 0){
        alert("제출한 랩비는 5000원 단위로 입력해 주세요.");
        return;
    }

    if(submitFeeValue < 0 || plusValue < 0 || minusValue < 0 || submitPenaltyValue < 0 ){
        alert("입력값을 양수로 입력해 주세요.");
        return;
    }

    let currentPenalty = parseInt(penaltyData.textContent);
    let userFee = parseInt(feeData.textContent);
    if(submitPenaltyValue > currentPenalty || submitFeeValue > userFee){
        alert("제출한 벌금이나 랩비가 현재 벌금이나 랩비보다 많습니다.");
        return;
    }

    currentPenalty += plusValue - minusValue - submitPenaltyValue;
    penaltyData.textContent = currentPenalty;
    submitFeeInput.value = "";
    plusPenalty.value = "";
    minusPenalty.value = "";
    submitPenalty.value = "";

    userFee -= submitFeeValue - submitPenaltyValue;
    totalPenalty.textContent = totalPenaltyValue + submitFeeValue + submitPenaltyValue;
    await fetch(`/api/fee/${user.dataset.id}/manageFee`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            fee: userFee,
            submitFee: submitFeeValue,
            penalty: currentPenalty,
            submitPenalty: submitPenaltyValue}),
    });
};

const handleSetFeeClick = (event) => {
    event.preventDefault();
    const user = event.path[2];
    const feeData = user.querySelector(".currentFee");
    let curretFee = parseInt(feeData.textContent);
    if(event.target.className === "plusFee"){
        curretFee += 5000;
    }else{
        curretFee -= 5000;
    }
    feeData.textContent = curretFee;
}

const handleAllSubmitFeeClick = (event) => {
    event.preventDefault();
    for (let i = 0; i < btnSubmitFees.length; i++) {
        SubmitFee(btnSubmitFees[i].parentElement.parentElement);
    }
}

const handleSubmitTotalPenalty = async (event) => {
    event.preventDefault();
    const updateValue = inputTotalPenalty.value;
    totalPenalty.textContent = updateValue;

    await fetch(`/api/fee/updateTotalFee`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            updateValue,
        })
    });
}

for (let i = 0; i < btnSubmitFees.length; i++) {
    btnSubmitFees[i].addEventListener("click", handleSubmitFeeClick);
    plusFees[i].addEventListener("click", handleSetFeeClick);
    minusFees[i].addEventListener("click", handleSetFeeClick);
}

btnSubmitAll.addEventListener("click", handleAllSubmitFeeClick);
btnTotalPenalty.addEventListener("click", handleSubmitTotalPenalty);