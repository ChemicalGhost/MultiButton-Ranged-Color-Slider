import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { create } from "zustand";

//#region sliderStore contains all the values and variables being used in the slider 
const sliderStore = create((set) => ({
  btnColor: null,
  btnValue: null,
  btnArray: [],
}));
//#endregion

//#region This function prevents any function from being called multiple times within a split sec
function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);

    console.log(timer);
  };
}
//#endregion

//#region These functions are called on event trigger for the add & remove buttons (see lines 609 and 629)
function buttonOnHoverColorChange(e) {
  e.target.style.backgroundColor = "rgb(173, 114, 4)";
}
function buttonEndHoverColorChange(e) {
  e.target.style.backgroundColor = "rgb(243, 159, 4)";
}
//#endregion


//#region

const SliderUI = (props) => {
  const canvasRef = useRef(null);

  const updateSlider = useCallback(() => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    //Write canvas code like in vanilla

    canvas.height = 44;
    function getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }
    const toolTipDiv = document.querySelector(`.tooltip`);
    const toolTipCss = toolTipDiv.style;
    console.log(toolTipDiv);

    toolTipCss.visibility = "hidden";

    class sliderButton {
      constructor(xval, yval) {
        this.button = {
          color: null,
          x: xval,
          y: yval,
          width: 10,
          height: 10,
          isDragging: false,
          isSelected: false,
          value: null,
        };
      }
    }

    ////Slider Class
    class Slider {
      constructor(barLength) {
        this.barPositionX = 0;
        this.barPositionY = canvas.height / 2;
        this.barLength = barLength;
        this.buttonArray = [];
        this.selectionArray = [];
        this.btnInstance;
        let isEvent1On = false;

        //Immediately Invoked Event Method
        (function eventManager() {
          if (!isEvent1On) {
            // Function to handle mouse down events

            addEventListener("click", function btnClick(e) {
              const mouseX = e.clientX - canvas.getBoundingClientRect().left;
              const mouseY = e.clientY - canvas.getBoundingClientRect().top;

              slider.buttonArray.forEach((buttons) => {
                const distanceToStart = Math.sqrt(
                  (slider.barPositionX - buttons.x) ** 2 + 0
                );

                const btnValue = Math.round(
                  (distanceToStart / (slider.barLength - buttons.width)) * 100
                );

                const distanceFromMousePointerX = Math.sqrt(
                  (mouseX - buttons.x - 4.5) ** 2 + 0
                );
                const distanceFromMousePointerY = Math.sqrt(
                  0 ** 2 + (mouseY - buttons.y) ** 2
                );

                if (
                  distanceFromMousePointerX < buttons.width / 1.7 &&
                  distanceFromMousePointerY < buttons.height + 4
                ) {
                  slider.selectionArray.length < 1
                    ? (slider.selectionArray.push(buttons),
                      slider.updateBar(),
                      slider.updateButton(),
                      slider.selectedDrawEffect(buttons),
                      (slider.selectionArray[0].value = btnValue),
                      sliderStore.setState({
                        btnValue: slider.selectionArray[0].value,
                      }),
                      sliderStore.setState({
                        btnColor: slider.selectionArray[0].color,
                      }),
                      console.log("SELECTION ARRAY", slider.selectionArray))
                    : slider.selectionArray.length > 0
                    ? slider.selectionArray.forEach((selectedButton) => {
                        if (buttons === selectedButton) {
                          console.log("ALREADY IN ARRAY!");
                          slider.selectionArray.length = 0;
                          sliderStore.setState({ btnColor: null });
                          sliderStore.setState({
                            btnValue: null,
                          });
                          ctx.clearRect(
                            buttons.x - 1,
                            0,
                            buttons.width + 3,
                            buttons.height
                          );
                          slider.drawBar();
                          slider.updateBar();
                          slider.updateButton();
                          console.log("SELECTION ARRAY", slider.selectionArray);
                        } else {
                          slider.selectionArray.length = 0;
                          slider.selectionArray.push(buttons);
                          ctx.clearRect(
                            buttons.x - 1,
                            0,
                            buttons.width + 3,
                            buttons.height
                          );
                          slider.selectionArray[0].value = btnValue;

                          sliderStore.setState({
                            btnValue: slider.selectionArray[0].value,
                          });
                          sliderStore.setState({
                            btnColor: slider.selectionArray[0].color,
                          });
                          slider.drawBar();
                          slider.updateBar();
                          slider.updateButton();
                          slider.selectedDrawEffect(buttons);
                          console.log("SELECTION ARRAY", slider.selectionArray);
                        }
                      })
                    : console.log("SELECTION ARRAY", slider.selectionArray);
                }
              });
            });

            addEventListener("mousedown", function btnMouseDown(e) {
              const mouseX = e.clientX - canvas.getBoundingClientRect().left;
              const mouseY = e.clientY - canvas.getBoundingClientRect().top;

              slider.buttonArray.forEach((buttons) => {
                const distanceFromMousePointerX = Math.sqrt(
                  (mouseX - buttons.x - 4.5) ** 2 + 0
                );
                const distanceFromMousePointerY = Math.sqrt(
                  0 ** 2 + (mouseY - buttons.y) ** 2
                );

                if (
                  distanceFromMousePointerX < buttons.width / 1.7 &&
                  distanceFromMousePointerY < buttons.height + 4
                ) {
                  buttons.isDragging = true;
                }

                //This Segment is to make sure not more than one button can be dragged at a time
                const multiIsDragging = slider.buttonArray.filter(
                  (button) => button.isDragging === true
                );
                //console.log("multiIsDragging", multiIsDragging);

                if (multiIsDragging.length >= 2) {
                  multiIsDragging.forEach((button) => {
                    button.isDragging = false;
                  });
                  const arrIndex = Math.floor(
                    Math.random() * multiIsDragging.length
                  );

                  //Randomly changes one to true
                  multiIsDragging[arrIndex].isDragging = true;
                }

                // Function to handle mouse move event
                addEventListener("mousemove", function btnMove(e) {
                  if (buttons.isDragging) {
                    if (
                      e.clientX >
                        slider.barPositionX +
                          canvas.getBoundingClientRect().left &&
                      e.clientX <
                        slider.barPositionX +
                          slider.barLength -
                          buttons.width +
                          canvas.getBoundingClientRect().left
                    ) {
                      buttons.x =
                        e.clientX - canvas.getBoundingClientRect().left;

                      toolTipCss.left = buttons.x + "px";
                      toolTipCss.top = canvas.style.top - 15 + "px";
                      toolTipCss.visibility = "visible";
                    }
                    if (
                      e.clientX >
                      slider.barPositionX +
                        slider.barLength -
                        buttons.width +
                        canvas.getBoundingClientRect().left
                    ) {
                      buttons.x =
                        slider.barPositionX + slider.barLength - buttons.width;
                      // console.log("100%%");
                    }
                    if (
                      e.clientX <
                      slider.barPositionX + canvas.getBoundingClientRect().left
                    ) {
                      buttons.x = slider.barPositionX;
                      //console.log("0%%");
                    }

                    slider.drawBar();
                    slider.updateBar();
                    slider.updateButton();

                    const distanceToStart = Math.sqrt(
                      (slider.barPositionX - buttons.x) ** 2 + 0
                    );

                    const btnValue = Math.round(
                      (distanceToStart / (slider.barLength - buttons.width)) *
                        100
                    );
                    buttons.value = btnValue;
                    sliderStore.setState({ btnValue: buttons.value });
                    // console.log(buttons.x, buttons.y);
                    // console.log("distanceToStart VALUE", distanceToStart);
                    //console.log("BUTTON VALUE", btnValue, buttons.value);
                    //TOOLTIP UPDATES
                    toolTipDiv.textContent = buttons.value;
                    toolTipCss.backgroundColor = buttons.color;
                  }
                  isEvent1On = true;
                });
                // Function to handle mouse up event
                addEventListener("mouseup", function btnMouseUp() {
                  buttons.isDragging = false;
                  isEvent1On = true;
                  toolTipCss.visibility = "hidden";
                  //console.log("btnSelectionArray", btnSelectionArray);
                });
              });
              // console.log("DONE!!!!!!!!!!!!!!!!!!!");
              // console.log("DONE!!!!!!!!!!!!!!!!!!!");
            });
            isEvent1On = true;
            console.log(isEvent1On);
            //public interface
          }
        })();
      }

      addButton() {
        if (this.buttonArray.length < 7) {
          slider.btnInstance = new sliderButton();
          this.btnInstance.button.color = `rgb(${Math.random() * 255},${
            Math.random() * 255
          },${Math.random() * 255}`;
          this.btnInstance.indexNum = this.buttonArray.length;

          if (this.buttonArray.length == 0) {
            this.btnInstance.button.x = this.barLength / 2;
          }
          if (this.buttonArray.length >= 1) {
            this.btnInstance.button.x =
              this.buttonArray[this.buttonArray.length - 1].x / 2;
          }
          this.buttonArray.push(this.btnInstance.button);
          sliderStore.setState({ btnArray: this.buttonArray });

          // console.log("BUTTON ARRAY: ", this.buttonArray);
          // console.log(
          //   "BUTTON ARRAY: ",
          //   this.buttonArray[this.buttonArray.length - 1]
          // );
          this.btnInstance.button.y = this.barPositionY + 10;

          gsap.fromTo(
            this.buttonArray[this.buttonArray.length - 1],
            { x: -10 },
            {
              x: this.buttonArray[this.buttonArray.length - 1].x,
              duration: 0.5,
              onUpdate: () => {
                slider.drawBar();
                slider.updateBar();
                slider.updateButton();
                ctx.fillStyle =
                  this.buttonArray[this.buttonArray.length - 1].color;
                ctx.strokeStyle = "black";
                ctx.beginPath();

                ctx.fillRect(
                  this.buttonArray[this.buttonArray.length - 1].x,
                  this.buttonArray[this.buttonArray.length - 1].y,
                  this.buttonArray[this.buttonArray.length - 1].width,
                  this.buttonArray[this.buttonArray.length - 1].height
                );

                ctx.closePath();
                ctx.fill();

                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
              },
              onComplete: () => {
                this.updateButton();

                // Highlights the button that has been selected
                if (this.selectionArray !== 0) {
                  this.selectionArray.forEach((buttons) => {
                    slider.selectedDrawEffect(buttons);
                  });
                  console.log("SELECTION ARRAY!!!", this.selectionArray);
                } else {
                  console.log("CANT HIGHLIGHT EMPTY!", this.selectionArray);
                }
              },
            }
          );

          // this.btnInstance.drawButton();
        } else {
          console.log("???????????????????????????LIMIT REACHED!!");
        }
      }

      removeButton() {
        if (this.buttonArray.length > 1) {
          if (this.selectionArray.length > 0) {
            this.buttonArray.forEach((btnArrItem) => {
              if (btnArrItem === this.selectionArray[0]) {
                const indexToRemove = this.buttonArray.indexOf(btnArrItem);
                console.log(indexToRemove);
                if (indexToRemove !== -1) {
                  this.buttonArray.splice(indexToRemove, 1);
                  this.selectionArray.splice(indexToRemove, 1);
                  this.buttonArray.sort(function (a, b) {
                    return a.x - b.x;
                  });
                  this.selectionArray.length = 0;
                  console.log("BUTTON ARRAY", this.buttonArray);
                }
              } else {
                console.log("Array Empty");
                // this.selectionArray.length = 0;
              }
            });
          }
        } else {
          console.log("Can't remove Only Button");
        }
      }

      selectedDrawEffect(button) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();

        ctx.globalCompositeOperation = "difference";
        ctx.strokeRect(
          button.x + 1.5,
          button.y + 1.5,
          button.width - 3,
          button.height - 3
        );
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.globalCompositeOperation = "normal";
        ctx.moveTo(button.x, slider.barPositionY + button.height / 1.5);
        ctx.lineTo(button.x + button.width / 2, slider.barPositionY);
        ctx.lineTo(
          button.x + button.width,
          slider.barPositionY + button.height / 1.5
        );
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.fill();
      }

      updateButton() {
        //Sorts rendering overlay order of buttons and colored bars
        this.buttonArray.sort(function (a, b) {
          return b.x - a.x;
        });
        //console.log("After Sorted:", this.buttonArray);
        this.buttonArray.forEach((button) => {
          ctx.fillStyle = button.color;

          ctx.beginPath();
          ctx.strokeStyle = "rgb(30,30,30)";
          ctx.fillRect(button.x, button.y, button.width, button.height);
          ctx.rect(button.x, button.y, button.width, button.height);
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.moveTo(button.x, slider.barPositionY + button.height / 1.5);
          ctx.lineTo(button.x + button.width / 2, slider.barPositionY);
          ctx.lineTo(
            button.x + button.width,
            slider.barPositionY + button.height / 1.5
          );
          ctx.closePath();

          ctx.lineWidth = 2;

          ctx.stroke();
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = "rgb(128,128,128)";

          ctx.rect(
            button.x + 1,
            button.y + 1,
            button.width - 2,
            button.height - 2
          );
          ctx.moveTo(button.x, slider.barPositionY + button.height / 1.5);
          ctx.lineTo(button.x + button.width / 2, slider.barPositionY);
          ctx.lineTo(
            button.x + button.width,
            slider.barPositionY + button.height / 1.5
          );
          ctx.lineWidth = 1;

          ctx.stroke();
        });
      }

      drawBar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        canvas.width = this.barPositionX + this.barLength + 4;
        ctx.moveTo(this.barPositionX, this.barPositionY);
        ctx.lineTo(this.barPositionX + this.barLength, this.barPositionY);

        ctx.lineCap = "round";
        ctx.lineWidth = 20;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
      }
      updateBar() {
        this.buttonArray.sort(function (a, b) {
          return a.x - b.x;
        });

        this.buttonArray.forEach((buttons) => {
          ctx.beginPath();
          ctx.lineCap = "butt";
          ctx.moveTo(buttons.x + buttons.width / 2, slider.barPositionY);

          ctx.lineTo(this.barPositionX + this.barLength, this.barPositionY);
          ctx.lineWidth = 20;
          ctx.strokeStyle = buttons.color;

          ctx.stroke();
          ctx.closePath();
        });
      }
    }

    const slider = new Slider(props.length);

    const addButtonGUI = document.querySelector(`.btnAdd`);
    addButtonGUI.onclick = () => {
      slider.addButton();
      slider.updateBar();
      slider.updateButton();
    };

    const removeButtonGUI = document.querySelector(`.btnRemove`);
    removeButtonGUI.onclick = function click() {
      slider.drawBar();
      slider.removeButton();
      slider.updateBar();
      slider.updateButton();
    };

    const handleDOMContentLoaded = () => {
      // Code to run after the document has finished loading
      addButtonGUI.click();
      console.log("Document has finished loading!");
    };

    // Check if the document is already loaded
    if (document.readyState === "loading") {
      // Document is still loading, add an event listener
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
    } else {
      // Document has already finished loading, execute the code immediately

      handleDOMContentLoaded();
    }

    slider.drawBar();
    slider.updateButton();

    //Update Slider
    slider.updateBar();
    console.log(slider);

    ////////
    // Handles The render loop for canvas(Optional to use Depending on your project)
    // const renderLoop = () => {
    //   ///Code will be rendered every second
    //   requestAnimationFrame(renderLoop);
    // };
    //renderLoop();
    console.log("SELECTION ARRAY", slider.selectionArray);
  });

  const sliderDebounced = debounce(() => updateSlider());
  useEffect(() => {
    sliderDebounced();

    return () => {
      ////
    };
  }, [sliderDebounced]);

  return (
    <>
      <div
        className={"slider"}
        style={{
          msUserSelect: "none",
          MozUserSelect: "none",
          display: "flex",

          // border: 4,
          borderStyle: "solid",
          // borderColor: "rgb(29, 143, 156)",
          width: "fit-content",
          padding: 0,
          margin: 0,
          alignItems: "center",
        }}
      >
        <canvas
          className={"cnvBody"}
          ref={canvasRef}
          {...props}
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          <div className={"tooltip"}></div>
        </canvas>
        <button
          className={"btnAdd"}
          style={{
            margin: 1,
            textAlign: "center",
            padding: 2,
            fontWeight: "bold",
            color: " white",
            backgroundColor: "rgb(243, 159, 4)",
            border: 2,
            width: 20,
            height: 25,
            borderStyle: "solid",
            borderRadius: 7,
          }}
          onMouseOver={buttonOnHoverColorChange}
          onMouseOut={buttonEndHoverColorChange}
        >
          +
        </button>
        <button
          className={"btnRemove"}
          style={{
            margin: 1,
            textAlign: "center",
            padding: 0,
            fontWeight: "bold",
            color: " white",
            backgroundColor: "rgb(243, 159, 4)",
            border: 2,
            width: 20,
            height: 25,
            borderStyle: "solid",
            borderRadius: 7,
          }}
          onMouseOver={buttonOnHoverColorChange}
          onMouseOut={buttonEndHoverColorChange}
        >
          -
        </button>
      </div>
    </>
  );
};
//#endregion
export default SliderUI;
