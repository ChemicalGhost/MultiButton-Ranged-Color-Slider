Color Slider Component Manual<br/>
Last Manual Update: 5th January,2024

# Installation

1. Copy the following files to your prefered directory/folder:

   - slider.js (That's all you really need)

   - ReadMe(Installation and Use).txt (just in case you forget or get lost)
     or you could just copy the whole folder for convenience sake.(Your call)

2. Kindly install the following dependency(ies)
   (List might increase depending on future updates):
   -gsap
   -zustand

3. Import SliderUI from.....(insert folder where the slider.js script resides)

4. You are good to go.

# Usage/Implementation of the slider in project or script

Usable Prop(s) for the slider: length. (this controls the length of the slider bar)
e.g.

```js
<Slider length={170} />
```

To use the the SliderUI component just insert it in any div in your react file. That's it.

e.g.

```js
<div className={styles.colorSlider}>
  <SliderUI length={153} />
</div>
```

# Accessing control variables from the slider

There are 1 control variables that can be accessed
and updated from the sliderStore.js:

- btnArray

NOTE: There might be more control variables that
will be made accessible in future updates
To access any of them type:

Eg.

- 1 Accessing the currently selected button's color

```js
sliderStore.getState((state) => {
  state.btnColor;
});
```

to update any of them:
Eg.1 Updating the Value of the button's color

```js
sliderStore.setState({
  btnValue: newUpdateColor,
});
```
