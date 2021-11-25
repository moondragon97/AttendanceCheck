const feeSubmit = document.querySelector(".feeSubmit");

const handleFeeSubmitClick = (event) => {
    event.preventDefault();
    console.log(feeSubmit);
}

feeSubmit.addEventListener("click", handleFeeSubmitClick);