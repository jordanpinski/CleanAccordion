![Pixelcoulee Logo](https://siasky.net/AABLe6NEcRQSDcamGmncceJG0yMsFdtDMNQ0ghcqLyS5qQ)

# CleanAccordion
A minimal, efficient, vanilla JavaScript accordion. Only 4KB total!

## Installation
Include the CSS/JS in your HTML.

```
<link href="css/theme.min.css" type="text/css" rel="stylesheet" />
```
```
<script src='js/clean-accordion.min.js'></script>
```

## Basic Usage
Add the required HTML & initialize.
```
<div data-accordion-group>

  <div data-accordion>
    <div data-control>Heading 1</div>
    <div data-content>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quasi maxime, qui sed ex sunt, exercitationem obcaecati omnis vel sequi facere esse! Rem, sapiente fugiat esse itaque maiores deleniti aspernatur.</p>
    </div>
  </div>

  <div data-accordion>
    <div data-control>Heading 2</div>
    <div data-content>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quasi maxime, qui sed ex sunt, exercitationem obcaecati omnis vel sequi facere esse! Rem, sapiente fugiat esse itaque maiores deleniti aspernatur.</p>
    </div>
  </div>

</div>
```
```
<script>

  const elements = document.querySelectorAll('[data-accordion-group]');

  // Without options passed
  let cleanAccordion = new CleanAccordion(elements);

  // With options passed
  let cleanAccordion = new CleanAccordion(elements, {
    ... Options
  });

</script>
```

## API
### Constructor Arguments
The `new CleanAccordion()` instruction you execute on your page can take two parameters:

| Parameter | What to pass | Required | Default value | Type |
| --------- | ------------ | -------- | ------------- | ---- |
| Element | The clean accordion DOM element/s | Yes | `null` | Dom Element |
| Options | The option object for this instance of CleanAccordion | No | `{}` | Plain Object |

### Options
For every instance of *CleanAccordion* you can pass in some options to alter the behavior.

| Name | Meaning | Default Value | Example Value |
| ---- | ------- | ------------- | ------------- |
| singleOpen | Whether a single accordion can be open at a time | true | true |
| beforeOpen | A function that's called before an accordion is opened | function(accordion) {} | function(accordion) {} |
| afterOpen | A function that's called after an accordion is opened | function(accordion) {} | function(accordion) {} |
| beforeClose | A function that's called before an accordion is closed | function(accordion) {} | function(accordion) {} |
| afterOpen | A function that's called after an accordion is closed | function(accordion) {} | function(accordion) {} |

### Data Options
Options can also be passed through HTML by adding a data-options attribute to the root element (data-accordion-group)

```
<div data-accordion-group data-options='{"singleOpen":false}'>
  ...
</div>
```