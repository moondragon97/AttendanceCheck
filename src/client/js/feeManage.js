const submitFees = document.querySelectorAll(".submitFee");
const plusFees = document.querySelectorAll(".plusFee");
const minusFees = document.querySelectorAll(".minusFee");
const btnSubmitAll = document.querySelector(".btnSubmitAll");

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
    
    let plusValue = parseInt(plusPenalty.value);
    let minusValue = parseInt(minusPenalty.value);
    let submitValue = parseInt(submitPenalty.value);
    plusValue = Number.isInteger(plusValue) ? plusValue : 0;
    minusValue = Number.isInteger(minusValue) ? minusValue : 0;
    submitValue = Number.isInteger(submitValue) ? submitValue : 0;

    let currentPenalty = parseInt(penaltyData.textContent);
    currentPenalty += plusValue - minusValue - submitValue;
    penaltyData.textContent = currentPenalty;
    plusPenalty.value = 0;
    minusPenalty.value = 0;
    submitPenalty.value = 0;

    const userFee = parseInt(feeData.textContent);
    
    await fetch(`/api/fee/${user.dataset.id}/manageFee`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            fee: userFee,
            penalty: currentPenalty,
            submit: submitValue}),
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
    for (let i = 0; i < submitFees.length; i++) {
        SubmitFee(submitFees[i].parentElement.parentElement);
    }
}

for (let i = 0; i < submitFees.length; i++) {
    submitFees[i].addEventListener("click", handleSubmitFeeClick);
    plusFees[i].addEventListener("click", handleSetFeeClick);
    minusFees[i].addEventListener("click", handleSetFeeClick);
}

btnSubmitAll.addEventListener("click", handleAllSubmitFeeClick);