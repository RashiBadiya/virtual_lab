/* globals
  ClockData: false
  ClockDirection: false
  containsPoint: false
  createjs: false
  DigitalClock: false
  Menu: false
  stage: false
  ToolPresentationEngine: false
  Virtual_Labs: false
*/

function Coagulase(lib) {
  let main_mc; // :MainScreen
  let menuMC; // :Menu
  let numPlates; // :int
  let elemsArray = []; // :Array
  let cleanupArray = []; // :Array
  let rand; // :int
  let randNum; // :Number
  let numStirs; // :Number
  let overColony; // :Boolean
  let cursor_type; // :String
  let mustStirNow; // :String

  let bottle_mc; // :water_bottle
  let dropper_mc; // :dropper
  let waterBottleAnimation_mc; // :waterBottleAnimation
  let dropperAnimation_mc; // :dropperAnimation
  let stick_mc; // :stickWithBacteria
  let petriAnimation_mc; // :petriDISH
  let stick_to_slide_mc; // :stick_to_slide
  let overlay_background_mc; // :overlay_background
  let slide_rocking_mc; // :slide_rocking
  let stick_shadow_bmp; // stick shadow
  let bottle_shadow_bmp; // H2O bottle shadow

  let currentBacteria; // :String
  let curr_slide; // :MovieClip
  let hintStir; // :MovieClip
  let hintRock; // :MovieClip

  let num_water_drops; // :int
  let num_drops_cloudy; // :int
  let num_rabbit_drops; // :int

  let myFilters = []; // :Array
  let tpe; // :ToolPresentationEngine

  let dropper_start_x = 590.3; // :Number
  let dropper_start_y = 334.3; // :Number
  let rockCounterTotal; // :int

  let startTime; // :Date
  let endTime; // :Date
  let clockData; // :ClockData
  let digital_clock; // :DigitalClock

  const acceptableAlpha = 0.1;
  let pickedObject = null;

  // stir speed control
  const detectEvery = 4;
  let stirMoveCounter = 0;

  let rockFrameCounter = 0;
  const rockInterval = 50;
  let rocking = null;
  let clockStarted = false;

  // -------------------------------------------------------------------------------------------
  //  Method  : init()
  //  Purpose : sets up the lab, brings up the initial state, menu showing
  // ------------------------------------------------------------------------------
  this.init = () => {
    stage.frameRate = 20;

    main_mc = new lib.MainScreen();
    stage.addChild(main_mc);
    main_mc.name = 'main_mc';
    main_mc.mouseEnabled = false;
    dropper_mc = new lib.dropper();
    dropper_mc.name = 'dropper_mc';
    stage.addChild(dropper_mc);
    dropper_mc.scaleX = 0.34;
    dropper_mc.scaleY = 0.34;
    dropper_mc.rotation = 5.5;
    dropper_start_x = 587.3;
    dropper_start_y = 365.1;
    dropper_mc.x = dropper_start_x;
    dropper_mc.y = dropper_start_y;
    dropper_mc.mouseEnabled = false;
    dropper_mc.mouseChildren = false;
    elemsArray.push(
      main_mc.petri1_btn,
      main_mc.petri2_btn,
      main_mc.stickbox_btn,
      main_mc.slide1_btn,
      main_mc.slide2_btn,
      main_mc.trash_btn,
      main_mc.h2o_btn,
      main_mc.sharps_btn,
      main_mc.dropper_btn
    );
    cleanupArray.push(
      'bottle_mc',
      'bottle_shadow_bmp',
      'dropperAnimation_mc',
      'stick_mc',
      'petriAnimation_mc',
      'stick_to_slide_mc',
      'overlay_background_mc',
      'slide_rocking_mc',
      'hintStir',
      'hintRock'
    );

    stage.addEventListener('close_window', myCloseWindowFunc, false);
    stage.addEventListener('open_window', myOpenWindowFunc, false);

    stage.addEventListener('OK', enableButtons);

    main_mc.agar_label_right.mouseEnabled = false;
    main_mc.agar_label_right.mouseChildren = false;
    main_mc.agar_label_left.mouseEnabled = false;
    main_mc.agar_label_left.mouseChildren = false;

    const menuInitDone = () => {
      menuMC.name = 'menuMC';
      menuMC.loadStepsXML('../xml/coagulase_steps.xml');
      menuMC.loadDescriptionXML('../xml/coagulase_description.xml');
      menuMC.loadCreditsXML('../xml/coagulase_credits.xml');
      stage.addEventListener(Menu.START, startLab);
      stage.addEventListener(Menu.RESTART, restartLab);
      stage.addEventListener(Menu.CLOSE_WINDOW, menuEventHandler, false);
      stage.addEventListener(Menu.OPEN_WINDOW, menuEventHandler);
      stage.addEventListener(Menu.MENU_BUTTON_OVER, menuButtonOver);
      stage.addEventListener(Menu.MENU_BUTTON_OUT, menuButtonOut);
    };
    menuMC = new Menu(lib, menuInitDone);
    stage.addChild(menuMC);

    beginLab();
    main_mc.mouseEnabled = false;
  };

  const menuEventHandler = (e) => { // e:Event
    if (e.type === Menu.CLOSE_WINDOW) {
      main_mc.mouseEnabled = true;
    } else if (e.type === Menu.OPEN_WINDOW) {
      main_mc.mouseEnabled = false;
    }
  };

  // -------------------------------------------------------------------------------------------
  //  Method  : startLab()
  //  Purpose : Does Nothing, used by class
  // ------------------------------------------------------------------------------
  function startLab(e) { // e:Event
    beginLab();
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : beginLab()
  //  Purpose : Initiates the experiment
  // ------------------------------------------------------------------------------
  function beginLab() {

    main_mc.mouseEnabled = true;

    // Some cleanup
    for (let g = 0; g < cleanupArray.length; g += 1) {
      var this_one = stage.getChildByName(cleanupArray[g]);
      if (this_one) {
        if (stage.contains(this_one)) {
          if (cleanupArray[g] === 'bottle_mc') {
            main_mc.water_bottle_stage.alpha = 1;
          }
          this_one.stop();
          stage.removeChild(this_one);
          this_one = null;
        }
      }
    }
    if (tpe) {
      tpe.dispose();
      tpe = null;
    }
    if (clockData) {
      clockData.removeEventListener('complete', rockedEnough);
      clockData = null;
    }

    randNum = -1;
    numStirs = 0;
    overColony = false;
    cursor_type = 'default';
    normalCursor();
    mustStirNow = '';

    main_mc.petri1.done = false;
    main_mc.petri2.done = false;

    main_mc.slide1.done = false;
    main_mc.slide2.done = false;

    main_mc.slide1.drop_num = 0;
    main_mc.slide2.drop_num = 0;

    main_mc.slide1.bacteria = '';
    main_mc.slide2.bacteria = '';
    main_mc.petri1.bacteria = '';
    main_mc.petri2.bacteria = '';

    main_mc.slide1.has_rabbit = false;
    main_mc.slide2.has_rabbit = false;

    num_water_drops = 0;
    num_drops_cloudy = 0;
    num_rabbit_drops = 0;
    rockCounterTotal = 0;

    randNum = parseInt(Math.random() * numPlates, 10);

    main_mc.petri1.bacteria = 'Staph. aureus';
    main_mc.petri2.bacteria = 'Staph. epidermidis';

    if (randNum === 0) {
      main_mc.petri1.bacteria = 'Staph. epidermidis';
      main_mc.petri2.bacteria = 'Staph. aureus';
    }

    main_mc.agar_label_left.label_text.text = main_mc.petri1.bacteria;
    main_mc.agar_label_right.label_text.text = main_mc.petri2.bacteria;
    currentBacteria = '';

    main_mc.slide1.mouseEnabled = false;
    main_mc.slide2.mouseEnabled = false;
    main_mc.slide1.mouseChildren = false;
    main_mc.slide2.mouseChildren = false;
    main_mc.slide1.alpha = 1;
    main_mc.slide2.alpha = 1;
    main_mc.slide1.drop.alpha = 0;
    main_mc.slide2.drop.alpha = 0;
    main_mc.slide1.drop.cloudy.alpha = 0;
    main_mc.slide2.drop.cloudy.alpha = 0;
    main_mc.slide1.drop.clumpy.alpha = 0;
    main_mc.slide2.drop.clumpy.alpha = 0;
    stage.addChild(main_mc.slide1);
    stage.addChild(main_mc.slide2);
    stage.addChild(main_mc.slide1_btn);
    stage.addChild(main_mc.slide2_btn);
    main_mc.slide1.x = 128;
    main_mc.slide2.x = 287;
    main_mc.slide1.y = 413;
    main_mc.slide2.y = 476;
    main_mc.slide1.filters = null;
    main_mc.slide2.filters = null;

    activateButtons();

    main_mc.petri1_btn.addEventListener('click', clickon_petri);
    main_mc.petri2_btn.addEventListener('click', clickon_petri);
    main_mc.slide1_btn.addEventListener('click', clickon_slide);
    main_mc.slide2_btn.addEventListener('click', clickon_slide);
    main_mc.trash_btn.addEventListener('click', clickon_trash);
    main_mc.sharps_btn.addEventListener('click', clickon_sharps);
    main_mc.stickbox_btn.addEventListener('click', clickon_stickbox);
    main_mc.h2o_btn.addEventListener('click', clickon_bottle);
    main_mc.dropper_btn.addEventListener('click', clickon_dropper);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : restartLab()
  //  Purpose : starts lab over
  // ------------------------------------------------------------------------------
  function restartLab(e) { // e:Event
    beginLab();
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : activateButtons()
  //  Purpose : add initial button states
  // ------------------------------------------------------------------------------
  function activateButtons() {
    for (let z = 0; z < elemsArray.length; z += 1) {
      elemsArray[z].alpha = acceptableAlpha;
      elemsArray[z].addEventListener('mouseover', toggleRollOver);
      elemsArray[z].addEventListener('mouseout', toggleRollOver);
      elemsArray[z].enabled = true;
      elemsArray[z].mouseEnabled = true;
      elemsArray[z].filters = null;
      elemsArray[z].visible = true;
    }
  }

  function disableButtons() {
    main_mc.mouseEnabled = false;
    menuMC.disableMenuButton();
  }

  function enableButtons() {
    main_mc.mouseEnabled = true;
    menuMC.enableMenuButton();
  }

  function tipPopup(message, centerText = false, callback = 'OK', width) {
    disableButtons();
    Virtual_Labs.tipPopup(stage, message, callback, null, centerText, width);
  }

  function stopPopup(message) {
    disableButtons();
    Virtual_Labs.stopPopup(stage, message);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : lockGlowOn()
  //  Purpose : locks a button as glowing and mouse-disabled
  // ------------------------------------------------------------------------------
  function lockGlowOn(btn) { // btn:SimpleButton
    btn.removeEventListener('mouseout', toggleRollOver);
    btn.mouseEnabled = false;
    btn.alpha = 1;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : myCloseWindowFunc()
  //  Purpose : Detects when a popup is closed so we can restore cursor
  // ------------------------------------------------------------------------------
  function myCloseWindowFunc(e) { // e:Event
    if (!tpe) {
      customCursor();
    } else {
      // Mouse.hide();
      main_mc.cursor = 'none';
      tpe.showTool();
    }
  }

  // -------------------------------------------------------------------------------------------
  // Method : myOpenWindowFunc()
  // Purpose  : Detects when a popup is opened
  // ------------------------------------------------------------------------------
  function myOpenWindowFunc(e) { // e:Event
    normalCursor();
    if (tpe) {
      tpe.hideTool();
    }
  }


  // -------------------------------------------------------------------------------------------
  //  Method  : clickon_bottle
  //  Purpose : handles clicking on water bottle
  // ------------------------------------------------------------------------------
  function clickon_bottle(e) { // e:MouseEvent
    const local = stage.globalToLocal(e.stageX, e.stageY);
    const mouseX = local.x;
    const mouseY = local.y;

    if (mustStirNow === '') {
      if (cursor_type === 'default') {
        if (num_water_drops < 2) {
          // disable and completely invisible H2O2 button while the bottle is moving
          pickedObject = main_mc.h2o2_btn;
          main_mc.h2o_btn.alpha = 0;
          main_mc.h2o_btn.visible = false;

          main_mc.water_bottle_stage.alpha = 0;
          bottle_mc = new lib.water_bottle();
          stage.addChild(bottle_mc);
          bottle_mc.mouseEnabled = false;
          bottle_mc.mouseChildren = false;
          bottle_mc.name = 'bottle_mc';
          bottle_mc.scaleX = 0.3;
          bottle_mc.scaleY = 0.3;
          bottle_mc.x = mouseX;
          bottle_mc.y = mouseY;
          bottle_mc.rotation = -15;
          cursor_type = 'bottle';

          // create bottle shadow
          createBottleShadow();
          stage.addChildAt(bottle_shadow_bmp, stage.getChildIndex(bottle_mc));
          bottle_shadow_bmp.x = bottle_mc.x + 20;
          bottle_shadow_bmp.y = bottle_mc.y + 15;

          customCursor();
        } else {
          tipPopup(`Tip: You've already placed a drop on each slide.
          There's no need to use the H₂O any more during this experiment.`, true);
        }
      } else if (cursor_type === 'bottle') {
        // activate H2O2 button back
        pickedObject = null;
        main_mc.h2o2_btn.alpha = acceptableAlpha;

        main_mc.water_bottle_stage.alpha = 1;
        stage.removeChild(bottle_mc);
        cursor_type = 'default';
        normalCursor();
      } else if (cursor_type === 'stick') {
        tipPopup('Tip: Used sticks go in the trash.', true);
      } else if (cursor_type === 'dropper') {
        // tipPopup('Tip: Used sticks go in the trash.', true);
      } else {
        tipPopup('Tip: Used slides go in the sharps container.', true);
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : clickon_dropper
  //  Purpose : handles clicking on dropper
  // ------------------------------------------------------------------------------
  function clickon_dropper(e) { // e:MouseEvent
    const local = stage.globalToLocal(e.stageX, e.stageY);
    const mouseX = local.x;
    const mouseY = local.y;

    if (mustStirNow === '') {
      if (cursor_type === 'default') {
        if (num_rabbit_drops < 2) {
          // not done with dropper yet
          if (num_rabbit_drops < num_drops_cloudy) {
            // there is at at least one drop ready for the rabbit plasma
            dropper_mc.mouseEnabled = false;
            dropper_mc.mouseChildren = false;
            main_mc.dropper_btn.alpha = 0;
            main_mc.dropper_btn.visible = false;
            // dropper_mc.filters = myFilters;
            createjs.Tween.get(dropper_mc).to({x: 600.5, y: 252.9}, 200)
              .addEventListener('complete', () => {
                createjs.Tween.get(dropper_mc).to({x: mouseX, y: mouseY, rotation: 35}, 200)
                  .addEventListener('complete', () => {
                    cursor_type = 'dropper';
                    customCursor();
                  });
              });
          } else {
            tipPopup('Tip: Prepare a slide for the rabbit plasma first.', true);
          }
        } else {
          tipPopup('Tip: You don\'t need any more rabbit plasma.', true);
        }
      } else if (cursor_type === 'bottle') {
        tipPopup('Tip: The water only goes on the slides.', true);
      } else if (cursor_type === 'dropper') {
        createjs.Tween.get(dropper_mc).to({x: 600.5, y: 252.9}, 200)
          .addEventListener('complete', () => {
            createjs.Tween.get(dropper_mc).to({x: dropper_start_x, y: dropper_start_y,
              rotation: 5.5}, 200).addEventListener('complete', () => {
              cursor_type = 'default';
              normalCursor();
            });
          });
      } else if (cursor_type === 'stick') {
        tipPopup('Tip: Used sticks go in the trash.', true);
      } else {
        tipPopup('Tip: Used slides go in the sharps container.', true);
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : clickon_slide
  //  Purpose : handles clicking on slide
  // ------------------------------------------------------------------------------
  function clickon_slide(e) { // e:MouseEvent
    var this_slide; // :MovieClip
    var curs_name; // :String
    var this_btn;
    if (e.currentTarget.name === 'slide1_btn') {
      this_slide = main_mc.slide1;
      curs_name = 'slide1';
      this_btn = main_mc.slide1_btn;
    } else {
      this_slide = main_mc.slide2;
      curs_name = 'slide2';
      this_btn = main_mc.slide2_btn;
    }
    if (mustStirNow === '') {
      if (cursor_type === 'default') {
        if (this_slide.bacteria !== '') {
          if (this_slide.has_rabbit === true) {
            curr_slide = this_slide;
            cursor_type = curs_name;
            this_btn.alpah = 0;
            this_btn.visible = false;
            customCursor();
            this_btn.mouseEnabled = false; // can't set it back down, must go in sharps
          } else {
            tipPopup('Tip: Did you forget to put rabbit plasma on the slide?');
          }
        } else if (this_slide.drop.alpha < 1) {
          tipPopup('Tip: Put a drop of H₂O on the slide first.', true);
        } else {
          tipPopup('Tip: Put bacteria on slide to test it.');
        }
      } else if (cursor_type === 'bottle') {
        if (this_slide.bacteria !== '') {
          tipPopup('Tip: Slide has already been used.');
        } else if (this_slide.drop_num > 0) {
          tipPopup('Tip: Slide already has a drop.');
        } else {
          curr_slide = this_slide;
          animateWaterBottle(e);
        }
      } else if (cursor_type === 'dropper') {
        if (this_slide.drop.clumpy.alpha > 0) {
          tipPopup('Tip: You\'ve already tested this slide, you should dispose of it.');
        } else if (this_slide.drop.cloudy.alpha < 0) {
          tipPopup('Tip: Put bacteria on the slide first.');
        } else {
          curr_slide = this_slide;
          animateDropper(e);
        }
      } else if (cursor_type === 'stick') {
        if (currentBacteria === '') {
          if (this_slide.bacteria !== '') {
            tipPopup('Tip: You have already tested bacteria on that slide.  Restart.');
          } else if (this_slide.drop_num > 0) {
            tipPopup('Tip: Get a sample bacteria colony on the stick first.');
          } else {
            tipPopup('Tip: Put a drop of H₂O on the slide first.');
          }
        } else {
          if (this_slide.bacteria !== '') {
            stopPopup('Stop: You have contaminated the experiment.  Restart.');
            cursor_type = 'default';
            normalCursor();
          } else if (this_slide.drop_num > 0) {
            curr_slide = this_slide;
            animateStickSlide(e);
          } else {
            tipPopup('Tip: Put a drop of H₂O on the slide first.');
          }
        }
      } else {
        tipPopup('Tip: Used slides go in the sharps container.', true);
      }
    } else if (mustStirNow === curs_name) {
      // STIR SLIDE
      curr_slide = this_slide;
      rockSlide();
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : clickon_trash
  //  Purpose : handles clicking on trash
  // ------------------------------------------------------------------------------
  function clickon_trash(e) { // e:MouseEvent
    if (mustStirNow === '') {
      if (cursor_type === 'default') {
        tipPopup('Tip: for this experiment, only the sticks go in the trash.');
      } else if (cursor_type === 'dropper') {
        tipPopup('Tip: put the dropper in the test tube if finished.');
      } else if (cursor_type === 'bottle') {
        tipPopup('Tip: set bottle back where you got it if finished.');
      } else if (cursor_type === 'stick') {
        cursor_type = 'default';
        main_mc.mouseChildren = false;
        customCursor();
        createjs.Tween.get(stick_mc).to({x: 803, y: 105.4, rotation: -90}, 1000)
          .addEventListener('complete', () => {
            createjs.Tween.get(stick_mc).to({alpha: 0, y: 135.4}, 500)
              .addEventListener('complete', () => {
                stage.removeChild(stick_mc);
                normalCursor();
                main_mc.mouseChildren = true;
                if (curr_slide.bacteria !== currentBacteria) {
                  // they didn't put the bacteria on the slide...reactivate everything
                  // so they can get more bacteria
                  activateButtons();
                }
                currentBacteria = '';
              });
          });
      } else {
        tipPopup('Tip: slides go in the sharps container, not the trash.');
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : clickon_petri
  //  Purpose : handles clicking on a petri dish
  // ------------------------------------------------------------------------------
  function clickon_petri(e) { // e:MouseEvent
    var this_petri; // :MovieClip
    var this_btn;
    if (e.currentTarget.name === 'petri1_btn') {
      this_petri = main_mc.petri1;
      this_btn = main_mc.petri1_btn;
    } else {
      this_petri = main_mc.petri2;
      this_btn = main_mc.petri2_btn;
    }

    if (mustStirNow === '') {
      if (this_petri.done === true) {
        tipPopup('Tip: You have already placed this bacteria on a slide.', true);
      } else {
        if (cursor_type === 'default') {
          tipPopup('Tip: Use a stick to collect an isolated bacteria colony.');
        } else if (cursor_type === 'bottle') {
          tipPopup('Tip: H₂O does not go in the petri dishes.');
        } else if (cursor_type === 'stick') {
          if (currentBacteria !== '') {
            stopPopup('Stop: You have contaminated the experiment.  Restart.');
            cursor_type = 'default';
            normalCursor();
          } else {
            lockGlowOn(this_btn);
            animatePetri();
            currentBacteria = this_petri.bacteria;
          }
        }
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  :  clickon_sharps
  //  Purpose : handles clicking on the sharps container
  // ------------------------------------------------------------------------------
  function clickon_sharps(e) { // e:MouseEvent
    if (mustStirNow === '') {
      if (cursor_type === 'default') {
        tipPopup('Tip: for this experiment, only the slides go in the sharps container.');
      } else if (cursor_type === 'bottle') {
        tipPopup('Tip: the dropper doesn\'t belong in the sharps container.');
      } else if (cursor_type === 'bottle') {
        tipPopup('Tip: the H₂O doesn\'t belong in the sharps container.');
      } else if (cursor_type === 'stick') {
        if (currentBacteria !== '') {
          // stopPopup(Stop: You have contaminated the experiment.  Restart.');
          tipPopup('Tip: for this experiment, only the slides go in the sharps container.');
          // cursor_type = 'default';
          // normalCursor();
        } else {
          tipPopup('Tip: Sticks should be trashed or used once removed from the box.');
        }
      } else {
        if (cursor_type === 'slide1') {
          main_mc.slide1.alpha = 0;
        } else {
          main_mc.slide2.alpha = 0;
        }
        cursor_type = 'default';
        normalCursor();
        if ((main_mc.slide1.alpha === 0) && (main_mc.slide2.alpha === 0)) {
          stopPopup('Congratulations on completing the Coagulase Test!');
        }
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  :  clickon_stickbox
  //  Purpose : handles clicking on the stickbox
  // ------------------------------------------------------------------------------
  function clickon_stickbox(e) { // e:MouseEvent
    if (mustStirNow === '') {
      if (cursor_type === 'bottle') {
        tipPopup(`Tip: Drops of H₂O should only be placed on unused slides.
      Put the bottle back if you\'re done with it.`);
      } else if (cursor_type === 'stick') {
        if (currentBacteria !== '') {
          stopPopup('Stop: You have contaminated the experiment.  Restart.');
          cursor_type = 'default';
          normalCursor();
        } else {
          tipPopup('Tip: Used sticks should go in the trash.');
        }
      } else if (cursor_type === 'default') {
        if (num_water_drops === 0 || num_water_drops === num_drops_cloudy) { // no untested drops
          if (main_mc.petri1.done === true && main_mc.petri2.done === true) {
            tipPopup('Tip: You don\'t need any more sticks.');
          } else {
            tipPopup('Tip: Put a drop of water on an unused slide first.');
          }
        } else {
          stick_mc = new lib.stickWithBacteria();
          stage.addChild(stick_mc);
          stick_mc.mouseEnabled = false;
          stick_mc.mouseChildren = false;
          // stick_mc.filters = myFilters;
          stick_mc.name = 'stick_mc';
          stick_mc.bacteria_mc.alpha = 0;
          stick_mc.bacteria_mc.mouseEnabled = false;
          stick_mc.bacteria_mc.mouseChildren = false;
          stick_mc.drop_contact_indicator.alpha = 0;
          stick_mc.drop_contact_indicator.mouseEnabled = false;
          stick_mc.drop_contact_indicator.mouseChildren = false;

          stick_mc.rotation = -20;
          stick_mc.scaleX = 0.3;
          stick_mc.scaleY = 0.3;
          cursor_type = 'stick';
          customCursor();

          // create stick shadow
          createStickShadow();
          stick_mc.addChild(stick_shadow_bmp);
        }
      } else {
        tipPopup('Tip: Used slides go in the sharps container.');
      }
    } else {
      tipPopup('Tip: You need to rock the slide you just added rabbit plasma to.', true);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : toggleRollOver()
  //  Purpose:  This method will handle the interface object button events.
  //  Params :  e -- MouseEvent object
  // ------------------------------------------------------------------------------
  function toggleRollOver(e) { // e:MouseEvent
    if (e.type === 'mouseover') {
      e.currentTarget.alpha = 1;
    } else if (e.type === 'mouseout') {
      if (e.currentTarget === pickedObject) return;
      e.currentTarget.alpha = acceptableAlpha;
      // Virtual_Labs.removeGlow(e.currentTarget);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : menuButtonOver()
  //  Purpose : This method responds to roll over events from the menu button.
  // ------------------------------------------------------------------------------
  function menuButtonOver(me) { // e:MouseEvent
    normalCursor();
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : menuButtonOut()
  //  Purpose : This method responds to roll out events from the menu button.
  // ------------------------------------------------------------------------------
  function menuButtonOut(me) { // e:MouseEvent
    if (menuMC.isVisible() === false) {
      customCursor();
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : followMouse()
  //  Purpose : This method causes the active mc to follow the mouse, which is hidden
  // ------------------------------------------------------------------------------
  function followMouse(e) { // e:MouseEvent
    const mouse = stage.globalToLocal(e.stageX, e.stageY);

    // trace ('followMouse()');
    let this_mc; // :MovieClip
    let this_shadow = null;
    switch (cursor_type) {
      case 'stick':
        this_mc = stick_mc;
        break;
      case 'bottle':
        this_mc = bottle_mc;
        this_shadow = bottle_shadow_bmp;
        break;
      case 'slide1':
        this_mc = main_mc.slide1;
        break;
      case 'slide2':
        this_mc = main_mc.slide2;
        break;
      case 'dropper':
        this_mc = dropper_mc;
        break;
      default:
    }
    if (this_mc) {
      this_mc.x = mouse.x;
      this_mc.y = mouse.y;
    }
    if (this_shadow) {
      this_shadow.x = mouse.x + 20;
      this_shadow.y = mouse.y + 15;
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : normalCursor()
  //  Purpose : Hides current cursor and shows default
  // ------------------------------------------------------------------------------
  function normalCursor() {
    main_mc.mouseEnabled = true;
    switch (cursor_type) {
      case 'stick':
        stick_mc.visible = false;
        stick_mc.filters = null;
        break;
      case 'bottle':
        bottle_mc.visible = false;
        bottle_mc.filters = null;
        bottle_shadow_bmp.visible = false;
        bottle_shadow_bmp.filters = null;
        break;
      case 'slide1':
        main_mc.slide1.visible = false;
        main_mc.slide1.filters = null;
        break;
      case 'slide2':
        main_mc.slide2.visible = false;
        main_mc.slide2.filters = null;
        break;
      case 'dropper':
        dropper_mc.visible = false;
        dropper_mc.filters = null;
        break;
      default:
    }
    // Mouse.show();
    main_mc.cursor = 'default';
    stage.removeEventListener('stagemousemove', followMouse);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : customCursor()
  //  Purpose : Restores custom cursor and hides default
  // ------------------------------------------------------------------------------
  function customCursor() {
    main_mc.mouseEnabled = true;
    switch (cursor_type) {
      case 'stick':
        stick_mc.visible = true;
        stick_mc.filters = myFilters;
        break;
      case 'bottle':
        bottle_mc.visible = true;
        bottle_mc.filters = myFilters;
        bottle_shadow_bmp.visible = true;
        break;
      case 'slide1':
        main_mc.slide1.visible = true;
        main_mc.slide1.filters = myFilters;
        break;
      case 'slide2':
        main_mc.slide2.visible = true;
        main_mc.slide2.filters = myFilters;
        break;
      case 'dropper':
        dropper_mc.visible = true;
        dropper_mc.filters = myFilters;
        // swap to show [Menu] button
        stage.swapChildren(dropper_mc, menuMC);
        break;
      default:
    }
    if (cursor_type !== 'default') {
      // Mouse.hide();
      main_mc.cursor = 'none';
      stage.addEventListener('stagemousemove', followMouse);
    }
  }


  // ___________________________________________________________________________________________
  //                    BEGIN WATER BOTTLE SECTION

  // -------------------------------------------------------------------------------------------
  //  Method  :  animateWaterBottle
  //  Purpose : This method adds the water bottle animation.
  // ------------------------------------------------------------------------------
  function animateWaterBottle(e) { // e:MouseEvent
    waterBottleAnimation_mc = new lib.waterBottleAnimation();
    stage.addChildAt(waterBottleAnimation_mc, stage.getChildIndex(menuMC));
    waterBottleAnimation_mc.name = 'waterBottleAnimation_mc';
    waterBottleAnimation_mc.x = 244.1;
    waterBottleAnimation_mc.y = 417.9;
    bottle_mc.alpha = 0;
    bottle_shadow_bmp.alpha = 0;

    waterBottleAnimation_mc.on('tick', function() {
      if (waterBottleAnimation_mc.currentFrame === 29) {
        wbFrame29();
      } else if (waterBottleAnimation_mc.currentFrame === 55) {
        wbFrame55();
      } else if (waterBottleAnimation_mc.currentFrame === 74) {
        wbFrame74();
        this.off();
        // activate H2O button back
        pickedObject = null;
        main_mc.h2o_btn.alpha = acceptableAlpha;
        main_mc.h2o_btn.visible = true;
      }
    });

    num_water_drops += 1;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : wbFrame29
  //  Purpose : This sets the drop to a random frame
  // ------------------------------------------------------------------------------
  function wbFrame29() {
    rand = (Math.random() * 4) + 1;
    waterBottleAnimation_mc.drop.gotoAndStop(rand);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : wbFrame55
  //  Purpose : This sets the drop on a slide when dropper animation reaches
  //        a certain frame
  // ------------------------------------------------------------------------------
  function wbFrame55() {
    curr_slide.drop.alpha = 1;
    curr_slide.drop.gotoAndStop(rand);
    curr_slide.drop_num = rand;
    stage.removeChild(bottle_mc);
    // stage.removeChild(bottle_shadow_bmp);
    bottle_shadow_bmp.alpha = 0;
    main_mc.water_bottle_stage.alpha = 1;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : wbFrame74
  //  Purpose : shows mouse when animation is complete
  // ------------------------------------------------------------------------------
  function wbFrame74() {
    waterBottleAnimation_mc.stop();
    stage.removeChild(waterBottleAnimation_mc);
    waterBottleAnimation_mc = null;
    cursor_type = 'default';
    normalCursor();
  }

  // ___________________________________________________________________________________________
  //                    BEGIN PETRI SECTION

  // -------------------------------------------------------------------------------------------
  //  Method  : animatePetri
  //  Purpose : This method adds the petri animation.
  // ------------------------------------------------------------------------------
  function animatePetri() {

    petriAnimation_mc = new lib.petriDISH();
    stage.addChildAt(petriAnimation_mc, stage.getChildIndex(menuMC));
    petriAnimation_mc.name = 'petriAnimation_mc';
    petriAnimation_mc.gotoAndPlay('startLid');
    // stage.swapChildren(stick_mc, petriAnimation_mc);
    stage.removeChild(stick_mc);
    petriAnimation_mc.addChild(stick_mc);
    stick_shadow_bmp.alpha = 0;
    stick_mc.filters = null;
    cursor_type = 'default';
    customCursor();
    createjs.Tween.get(stick_mc).to({rotation: 0, scaleX: 0.75, scaleY: 0.75}, 200)
      .addEventListener('complete', () => {
        normalCursor();
        // Mouse.hide();
        petriAnimation_mc.cursor = 'none';
        tpe = new ToolPresentationEngine(petriAnimation_mc, stick_mc,
          petriAnimation_mc.petri_closeup.dish_mask, true, false, true);
      });

    petriAnimation_mc.addEventListener('mousedown', lockStick);
    petriAnimation_mc.addEventListener('click', pickColony);
    petriAnimation_mc.petri_closeup.isolated_colonies
      .addEventListener('mouseover', setOverColony);
    petriAnimation_mc.petri_closeup.isolated_colonies
      .addEventListener('mouseout', setOutColony);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : lockStick
  //  Purpose : Makes the stick not move once you start to click on a colony
  // ------------------------------------------------------------------------------
  function lockStick(e) { // e:MouseEvent
    tpe.drag = false;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : pickColony
  //  Purpose : Checks when stick is clicked on closeup of petri, see's if colony was picked
  // ------------------------------------------------------------------------------
  function pickColony(e) { // e:MouseEvent
    tpe.drag = true;
    if (overColony === true) {
      stick_mc.bacteria_mc.alpha = 1;
      createjs.Tween.get(petriAnimation_mc).to({alpha: 0}, 500);
      createjs.Tween.get(stick_mc).to({rotation: -20, scaleX: 0.35, scaleY: 0.35}, 500)
        .addEventListener('complete', () => {
          petriAnimation_mc.removeChild(stick_mc);
          stage.addChild(stick_mc);
          closePetriAnimation();
          // show stick's shadow again
          stick_shadow_bmp.alpha = 1;
        });
    } else {
      tpe.hideTool();
      tipPopup('Select an isolated colony of bacteria');
    }
    // tpe = new ToolPresentationEngine(this, stick_mc, petriAnimation.petri_closeup.dish_mask);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : setOverColony
  //  Purpose : Sets over overColony to true
  // ------------------------------------------------------------------------------
  function setOverColony(e) { // e:MouseEvent
    if ((tpe) && (tpe.drag !== false)) {
      overColony = true;
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : setOutColony
  //  Purpose : Sets over overColony to false
  // ------------------------------------------------------------------------------
  function setOutColony(e) { // e:MouseEvent
    if ((tpe) && (tpe.drag !== false)) {
      overColony = false;
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : closePetriAnimation
  //  Purpose : puts lid back on petri dish
  // ------------------------------------------------------------------------------
  function closePetriAnimation() {
    tpe.dispose();
    tpe = null;
    overColony = false;
    petriAnimation_mc.removeEventListener('click', pickColony);
    stage.removeChild(petriAnimation_mc);
    petriAnimation_mc = null;
    cursor_type = 'stick';
    customCursor();
  }

  // ___________________________________________________________________________________________
  //                    BEGIN STICK --> SLIDE SECTION

  // -------------------------------------------------------------------------------------------
  //  Method  : animateStickSlide
  //  Purpose : Zooms in on slide so we can place bacteria on slide
  // ------------------------------------------------------------------------------
  function animateStickSlide(e) { // e:MouseEvent
    stick_to_slide_mc = new lib.stick_to_slide();
    stick_to_slide_mc.on('tick', function() {
      if (stick_to_slide_mc.currentFrame === 5) {
        frameDrop5();
      } else if (stick_to_slide_mc.currentFrame === 23) {
        frameCursor23();
        this.off();
      }
    });
    // stick_mc.drop_contact_indicator.alpha = 0;
    stick_to_slide_mc.mouseChildren = false;
    stage.addChildAt(stick_to_slide_mc, stage.getChildIndex(menuMC));
    stage.addChild(stick_mc);
    stick_to_slide_mc.name = 'stick_to_slide_mc';
    stick_to_slide_mc.x = 69;
    stick_to_slide_mc.y = 54;

    hintStir = Virtual_Labs.tipPopupNoButton(stage, `Tip: Place stick over drop,
       then click and drag to stir.`, false, 280);

    customCursor();
    stick_to_slide_mc.cursor = 'none';
    stick_mc.filters = null;

    createjs.Tween.get(stick_mc).to({rotation: stick_mc.rotation - 30, scaleX: 1, scaleY: 1}, 1000);
    stick_to_slide_mc.addEventListener('mousedown', addStirListener);
    stick_to_slide_mc.addEventListener('click', removeStirListener);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : frameDrop5
  //  Purpose : Sets random drop on slide to match
  // ------------------------------------------------------------------------------
  function frameDrop5() {
    stick_to_slide_mc.drop.gotoAndStop(curr_slide.drop_num);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : frameCursor23
  //  Purpose : Sets the cursor to be the closeup stick
  // ------------------------------------------------------------------------------
  function frameCursor23() {
    stick_to_slide_mc.stop();
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : addStirListener
  //  Purpose : Sets the cursor to be the closeup stick
  // ------------------------------------------------------------------------------
  function addStirListener(e) { // e:MouseEvent
    // stick_to_slide_mc.addEventListener(MouseEvent.MOUSE_MOVE, stirCloudy);
    stage.addEventListener('stagemousemove', stirCloudy);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : removeStirListener
  //  Purpose : Sets the cursor to be the closeup stick
  // ------------------------------------------------------------------------------
  function removeStirListener(e) { // e:MouseEvent
    // stick_to_slide_mc.removeEventListener(MouseEvent.MOUSE_MOVE, stirCloudy);
    stage.removeEventListener('stagemousemove', stirCloudy);
    stick_mc.drop_contact_indicator.alpha = 0;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : stirCloudy
  //  Purpose : Checks if stick bacteria is contacting drop and reacts accordingly, making drop
  //            cloudy
  // ------------------------------------------------------------------------------
  function stirCloudy(e) { // e:MouseEvent
    stirMoveCounter = (stirMoveCounter + 1) % detectEvery;
    if (stirMoveCounter !== 0) return;

    const stickTip = stage.globalToLocal(e.stageX, e.stageY);
    const dropSquare = {
      x: stick_to_slide_mc.drop.x,
      y: stick_to_slide_mc.drop.y,
      width: stick_to_slide_mc.drop.nominalBounds.width,
      height: stick_to_slide_mc.drop.nominalBounds.height,
    };

    if (containsPoint(dropSquare, stickTip)) {
      numStirs += 1;
      if (numStirs === 1) {
        stick_to_slide_mc.drop.cloudy.alpha = 0.01;
      }
      if (numStirs % 5 === 0) {
        stick_to_slide_mc.drop.play();
        stick_to_slide_mc.drop.advance(400);
        stick_to_slide_mc.drop.stop();
        stick_mc.drop_contact_indicator.play();
        stick_mc.bacteria_mc.alpha = stick_mc.bacteria_mc.alpha * 0.9;
        stick_to_slide_mc.drop.cloudy.alpha = stick_to_slide_mc.drop.cloudy.alpha + 0.04;
      }
    }
    if (stick_mc.bacteria_mc.alpha <= 0.1) {
      stick_mc.bacteria_mc.alpha = 0;
      stick_to_slide_mc.removeEventListener('mousedown', addStirListener);
      stick_to_slide_mc.removeEventListener('click', removeStirListener);
      stage.removeEventListener('stagemousemove', stirCloudy);
      stage.removeChild(hintStir);
      cursor_type = 'default';
      customCursor();
      createjs.Tween.get(stick_mc).to({x: 443.05, y: 159.65}, 1000)
        .addEventListener('complete', () => {
          curr_slide.bacteria = currentBacteria;
          curr_slide.drop.cloudy.alpha = stick_to_slide_mc.drop.cloudy.alpha;
          createjs.Tween.get(stick_to_slide_mc.drop.cloudy).to({alpha: 0.8}, 1500)
            .addEventListener('complete', () => {
              num_drops_cloudy = num_drops_cloudy + 1;
              createjs.Tween.get(stick_to_slide_mc).to({alpha: 0}, 1000)
                .addEventListener('complete', () => {
                  stage.removeChild(stick_to_slide_mc);
                  cursor_type = 'stick';
                  customCursor();
                });
              createjs.Tween.get(stick_mc).to({scaleX: 0.3, scaleY: 0.3, rotation: -20}, 500);
            });
        });
    }
  }

  // ___________________________________________________________________________________________
  //                    BEGIN DROPPER SECTION

  // -------------------------------------------------------------------------------------------
  //  Method  :  animateDropper
  //  Purpose : This method adds the dropper animation.
  // ------------------------------------------------------------------------------
  function animateDropper(e) { // e:MouseEvent
    dropperAnimation_mc = new lib.dropperAnimation();
    stage.addChildAt(dropperAnimation_mc, stage.getChildIndex(menuMC));
    dropperAnimation_mc.name = 'dropperAnimation_mc';
    dropperAnimation_mc.x = 244.1;
    dropperAnimation_mc.y = 417.9;
    dropperAnimation_mc.drop.cloudy.alpha = 0.8;
    dropper_mc.alpha = 0; // hide dropper on main screen

    bottle_mc.alpha = false;
    bottle_shadow_bmp.alpha = false;
    if (e.target.name === 'slide1_btn') {
      curr_slide = main_mc.slide1;
      dropperAnimation_mc.drop.gotoAndStop(main_mc.slide1.drop_num);
      mustStirNow = 'slide1';
    } else {
      curr_slide = main_mc.slide2;
      dropperAnimation_mc.drop.gotoAndStop(main_mc.slide2.drop_num);
      mustStirNow = 'slide2';
    }
    curr_slide.has_rabbit = true;
    num_rabbit_drops = num_rabbit_drops + 1;
    dropperAnimation_mc.on('tick', function() {
      if (dropperAnimation_mc.currentFrame === 55) {
        dropperFrame55();
      } else if (dropperAnimation_mc.currentFrame === 74) {
        dropperFrame74();
        this.off();
        dropper_mc.alpha = 1; // show dropper on main screen
        main_mc.dropper_btn.alpha = acceptableAlpha;
        main_mc.dropper_btn.visible = true;
      }
    });
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : dropperFrame55
  //  Purpose : puts the dropper away
  // ------------------------------------------------------------------------------
  function dropperFrame55() {
    cursor_type = 'default';
    normalCursor();
    dropper_mc.x = dropper_start_x;
    dropper_mc.y = dropper_start_y;
    dropper_mc.rotation = 5.5;
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : dropperFrame74
  //  Purpose : shows mouse when animation is complete
  // ------------------------------------------------------------------------------
  function dropperFrame74() {
    dropperAnimation_mc.stop();
    stage.removeChild(dropperAnimation_mc);
    dropperAnimation_mc = null;
    stage.swapChildren(dropper_mc, menuMC);
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : rockSlide
  //  Purpose : starts the slide rocking
  // ------------------------------------------------------------------------------
  function rockSlide() {
    overlay_background_mc = new lib.overlay_background;
    slide_rocking_mc = new lib.slide_rocking;
    slide_rocking_mc.name = 'slide_rocking_mc';
    overlay_background_mc.name = 'overlay_background_mc';
    stage.addChild(overlay_background_mc);
    stage.addChild(slide_rocking_mc);
    slide_rocking_mc.alpha = 0;
    slide_rocking_mc.drop.cloudy.alpha = 0.8;
    slide_rocking_mc.drop.stop();
    overlay_background_mc.alpha = 0;
    overlay_background_mc.scaleX = stage.canvas.clientWidth
      / overlay_background_mc.nominalBounds.width;
    overlay_background_mc.scaleY = stage.canvas.clientHeight
      / overlay_background_mc.nominalBounds.height;

    hintRock = Virtual_Labs.tipPopupNoButton(stage, `Tip: Click on slide and hold for
      15 seconds to rock slide.`, false, 290);
    customCursor();

    slide_rocking_mc.gotoAndStop(0);
    slide_rocking_mc.slide_reflections.gotoAndStop(0);
    slide_rocking_mc.x = 20;
    slide_rocking_mc.y = 237.8;
    slide_rocking_mc.mouseChildren = false;
    createjs.Tween.get(overlay_background_mc).to({alpha: 1}, 500)
      .addEventListener('complete', () => {
        createjs.Tween.get(slide_rocking_mc).to({alpha: 1, x: 171.1}, 500)
          .addEventListener('complete', () => {
            slide_rocking_mc.buttonMode = true;
            slide_rocking_mc.addEventListener('mousedown', rockPress);
            slide_rocking_mc.addEventListener('click', rockRelease);
            stage.addEventListener('click', rockRelease);
            slide_rocking_mc.cursor = 'pointer';
            startTime = new Date(null, null, null, 0, 0, 15);
            endTime = new Date(null, null, null, 0, 0, 0);
            clockData = new ClockData(startTime, endTime, 1, 1, ClockDirection.BACKWARD);
            clockData.addEventListener('complete', rockedEnough);
            digital_clock = new DigitalClock(lib, clockData, 'MM:SS');
            digital_clock.alpha = 1;
            stage.addChild(digital_clock);
            createjs.Tween.get(hintRock).to({alpha: 1}, 500);
          });
      });
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : rockPress
  //  Purpose :
  // ------------------------------------------------------------------------------
  function rockPress(e) { // e:MouseEvent
    rocking = true;
    rockPlay();
    setTimeout(rockContinue, rockInterval);
    if (!clockStarted) {
      digital_clock.startClock();
      clockStarted = true;
    } else {
      digital_clock.resumeClock();
    }
  }

  function rockContinue() {
    if (!rocking) return;
    rockPlay();
    setTimeout(rockContinue, rockInterval);
  }


  // -------------------------------------------------------------------------------------------
  //  Method  : rockRelease
  //  Purpose : stops slide rocking animation
  // ------------------------------------------------------------------------------
  function rockRelease() { // e:MouseEvent
    digital_clock.stopClock();
    rocking = false;
    // Mouse.show();
    slide_rocking_mc.cursor = 'pointer';
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : rockPlay
  //  Purpose : advances slide rocking animation
  // ------------------------------------------------------------------------------
  function rockPlay() { // e:Event
    if (!rocking) return;
    // start Ben's timer
    rockCounterTotal++;
    // Mouse.hide();
    slide_rocking_mc.cursor = 'none';
    if (rockCounterTotal >= 100) {
      if (curr_slide.bacteria.indexOf('aureus') > -1) {
        slide_rocking_mc.drop.clumpy.alpha += 0.005;
        curr_slide.drop.clumpy.alpha += 0.005;
      }
    }
    // rockingSlide = true;
    if (slide_rocking_mc.currentFrame === 26) {
      slide_rocking_mc.gotoAndStop(1);
      slide_rocking_mc.slide_reflections.gotoAndStop(1);
      rockFrameCounter = 1;
    } else {
      rockFrameCounter += 1;
      slide_rocking_mc.gotoAndStop(rockFrameCounter);
      slide_rocking_mc.slide_reflections.gotoAndStop(rockFrameCounter);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : rockedEnough
  //  Purpose : handles when slide has been rocked 15 seconds
  // ------------------------------------------------------------------------------
  function rockedEnough(e) { // e:Event

    createjs.Tween.get(hintRock).to({alpha: 0}, 1000);
    slide_rocking_mc.gotoAndStop(1);
    slide_rocking_mc.slide_reflections.gotoAndStop(1);
    rocking = false;
    slide_rocking_mc.removeEventListener('mousedown', rockPress);
    slide_rocking_mc.removeEventListener('click', rockRelease);
    stage.removeEventListener('click', rockRelease);
    digital_clock.stopClock();
    // Mouse.show();
    main_mc.cursor = 'default';
    slide_rocking_mc.mouseEnabled = false;
    popupQuestion();
  }


  // -------------------------------------------------------------------------------------------
  //  Method  : popupQuestion
  //  Purpose :
  // ------------------------------------------------------------------------------
  function popupQuestion() {
    var s; // :String
    // s = 'Question: Is <i>' + curr_slide.bacteria + '</i> coagulase positive?';
    s = 'Question: Is ' + curr_slide.bacteria + ' coagulase positive or negative?';
    // Virtual_Labs.twoChoicePopup(stage, s, 'positive', 'negative', 'twoChoiceClick', 9, );
    var MCQmc; // :MovieClip
    MCQmc = Virtual_Labs.twoChoicePopup(stage, s, 'positive', 'negative', 'twoChoiceClick', 9);
    MCQmc.move(0, -105);
    MCQmc.bgAlpha(0);
    stage.addEventListener('twoChoiceClick1', twoChoiceClickPositive);
    stage.addEventListener('twoChoiceClick2', twoChoiceClickNegative);
    if (curr_slide.bacteria.indexOf('aureus') === -1) { // slide is not aureus
      if (main_mc.petri1.bacteria.indexOf('aureus') === -1) {
        main_mc.petri1.done = true; // petri 1 is not aureus - mark it done
      } else {
        main_mc.petri2.done = true; // petri 1 is aureus, mark other one done
      }
    } else { // slide IS aureus
      if (main_mc.petri1.bacteria.indexOf('aureus') === -1) {
        main_mc.petri2.done = true; // petri 1 is not aureus - mark other one done
      } else {
        main_mc.petri1.done = true; // petri 1 is aureus, mark it done
      }
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : twoChoiceClickPositive
  //  Purpose : Handles clicking the 'positive' response in the 2-choice popup question
  // ------------------------------------------------------------------------------
  function twoChoiceClickPositive(e) { // e:Event
    if (curr_slide.bacteria.indexOf('aureus') > -1) {
      animateRockSlideOut();
      if (main_mc.petri1.bacteria.indexOf('aureus') > -1) {
        // main_mc.agar_label_left.label_text.appendText('\nCoagulase Positive');
        main_mc.agar_label_left.label_text.text += '\ncoagulase positive';
      } else {
        main_mc.agar_label_right.label_text.text += '\ncoagulase positive';
      }
      enableButtons();
    } else {
      tipPopup('Tip: Try again!', true, 'TipClicked', 200);
      cursor_type = 'default';
      normalCursor();
      stage.addEventListener('TipClicked', tipClick);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : twoChoiceClickNegative
  //  Purpose : Handles clicking the 'negative' response in the 2-choice popup question
  // ------------------------------------------------------------------------------
  function twoChoiceClickNegative(e) { // e:Event
    if (curr_slide.bacteria.indexOf('aureus') === -1) {
      animateRockSlideOut();
      if (main_mc.petri1.bacteria.indexOf('aureus') === -1) {
        main_mc.agar_label_left.label_text.text += '\ncoagulase negative';
      } else {
        main_mc.agar_label_right.label_text.text += '\ncoagulase negative';
      }
      enableButtons();
    } else {
      tipPopup('Tip: Try again!', true, 'TipClicked', 200);
      cursor_type = 'default';
      normalCursor();
      stage.addEventListener('TipClicked', tipClick);
    }
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : tipClick
  //  Purpose : Re-triggers the popup question for when they anwswer incorrectly
  // ------------------------------------------------------------------------------
  function tipClick(e){ // e:Event
    popupQuestion();
  }

  // -------------------------------------------------------------------------------------------
  //  Method  : animateRockSlideOut
  //  Purpose :
  // ------------------------------------------------------------------------------
  function animateRockSlideOut() {
    cursor_type = 'default';
    normalCursor();
    stage.addChild(overlay_background_mc);
    stage.addChild(slide_rocking_mc);
    curr_slide.done = true;

    createjs.Tween.get(overlay_background_mc).to({alpha: 0}, 1000)
      .addEventListener('complete', () => {
        overlay_background_mc.stop();
        stage.removeChild(overlay_background_mc);
        overlay_background_mc = null;
      });
    createjs.Tween.get(slide_rocking_mc).to({alpha: 0}, 1000)
      .addEventListener('complete', () => {
        slide_rocking_mc.stop();
        stage.removeChild(slide_rocking_mc);
        slide_rocking_mc = null;
        if ((main_mc.slide1.done === true) && (main_mc.slide2.done === true)) {
          if (main_mc.slide1.alpha === 1 && main_mc.slide2.alpha === 1) {
            tipPopup('Tip: Remember to dispose of the slides in the SHARPS Biohazard container.',
              true);
          }
        }
      });
    stage.removeChild(digital_clock);
    digital_clock = null;
    mustStirNow = '';
  }

  const createStickShadow = () => { // source:Sprite
    stick_shadow_bmp = stick_mc.clone();
    // color filter to make the image black
    const cf = new createjs.ColorFilter(
      0,
      0,
      0,
      0.2,
      0, // red
      0, // green
      0, // blue
    );
    // create a blur filter and apply to the shadow
    const blurFilter = new createjs.BlurFilter(50, 20, 1);

    stick_shadow_bmp.filters = [cf, blurFilter];
    const b = stick_shadow_bmp.nominalBounds;
    stick_shadow_bmp.cache(-50, -50, b.width + 100, b.height + 100);

    stick_shadow_bmp.scaleX = 0.8;
    stick_shadow_bmp.scaleY = 0.8;
    stick_shadow_bmp.x = 30;
    stick_shadow_bmp.y = 40;
    stick_shadow_bmp.rotation = 5;
  };

  const createBottleShadow = () => { // source:Sprite
    bottle_shadow_bmp = bottle_mc.clone();
    // color filter to make the image black
    const cf = new createjs.ColorFilter(
      0,
      0,
      0,
      0.4,
      0, // red
      0, // green
      0, // blue
    );
    // create a blur filter and apply to the shadow
    const blurFilter = new createjs.BlurFilter(30, 30, 1);

    bottle_shadow_bmp.filters = [cf, blurFilter];
    const b = bottle_shadow_bmp.nominalBounds;
    bottle_shadow_bmp.cache(-50, -250, b.width + 100, b.height + 100);
    bottle_shadow_bmp.name = 'bottle_shadow_bmp';
  };

}

Coagulase.prototype = new createjs.MovieClip();

