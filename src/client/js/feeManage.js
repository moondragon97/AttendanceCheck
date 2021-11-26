const submitFees = document.querySelectorAll(".submitFee");
const plusFees = document.querySelectorAll(".plusFee");
const minusFees = document.querySelectorAll(".minusFee");

const handleSubmitFeeClick = (event) => {
    event.preventDefault();
    const user = event.path[3];
    console.log(user.dataset.id);
    const feeData = user.querySelector(".currentFee");
    const penaltyData = user.querySelector(".currentPenalty");
    const plusPenalty = parseInt(user.querySelector(".plusPenalty").value);
    const minusPenalty = parseInt(user.querySelector(".minusPenalty").value);
    const submitPenalty = parseInt(user.querySelector(".submitPenalty").value);
    let currentPenalty = parseInt(penaltyData.textContent);
    console.log(currentPenalty);
    console.log(plusPenalty);
    console.log(minusPenalty);
    console.log(submitPenalty);
    currentPenalty += plusPenalty - minusPenalty - submitPenalty;
    console.log(currentPenalty);
    //penaltyData.textContent = currentPenalty.toString();
    // fetch
}

const handleSetFeeClick = (event) => {
    event.preventDefault();
    const user = event.path[3];
    const feeData = user.querySelector(".currentFee");
    let curretFee = parseInt(feeData.textContent);
    if(event.target.className === "plusFee"){
        curretFee += 5000;
    }else{
        curretFee -= 5000;
    }
    feeData.textContent = curretFee;
}

for (let i = 0; i < submitFees.length; i++) {
    submitFees[i].addEventListener("click", handleSubmitFeeClick);
    plusFees[i].addEventListener("click", handleSetFeeClick);
    minusFees[i].addEventListener("click", handleSetFeeClick);

}