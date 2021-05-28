import React, { useState, useRef, useEffect } from "react";
import DraggablePiece from "./DraggablePiece";
import { useStyles } from "./style";
import TransitionsSnackbar from "../dialogNotifications/notification";
import useForceUpdate from "use-force-update";
import { Typography } from "@material-ui/core";
import AppNavBar from "../../components/navbar";

const { List } = require("immutable");
const httpGetProvin = {
  currentLvl: "nivel1",
};
//ABCDEFGHIJKLMNÑOPQRSTUVWWXYZ
const letters = ["ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];
const words = ["ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"];

const JigSawInit = () => {
  const [word, setWord] = useState(false),
    [arrayWord, setArrayWord] = useState([]),
    [arrayWordOriginal, setArrayWordOriginal] = useState([]),
    [currentLevel, setCurrentLevel] = useState(false),
    [levels, setlevels] = useState([]),
    [changeLvl, setchangeLvl] = useState(false);

  useEffect(() => {
    getClevel();
  }, []);
  const forceUpdate = useForceUpdate();
  const childRef = useRef();
  const getClevel = (value) => {
    setCurrentLevel(httpGetProvin.currentLvl);
    if (!currentLevel) {
      encodeLevels(httpGetProvin.currentLvl);
    } else {
      encodeLevels(value);
      setTimeout(() => {
        setchangeLvl(false);
      }, 800);
      forceUpdate();
    }
  };
  const encodeLevels = (item) => {
    let array = new Array();
    let i = 0;
    let lettersContainer = [];
    let lettersOriginal = [];

    words.forEach((element) => {
      let i = words.indexOf(element) + 1;
      array.splice(i, 0, "nivel" + i);
    });
    let lvlWord = words[0];

    Array.from(lvlWord).forEach((element) => {
      lettersContainer.push(element + i);
      i += 1;
    });
    // lettersOriginal = List(lettersContainer)._tail.array;
    // let ramdomWord = letters[0];
    // // Add other letter
    // Array.from(ramdomWord).forEach((element) => {
    //   lettersContainer.push(element + i);
    //   i += 1;
    // });
    lettersContainer = List(lettersContainer)._tail.array;
    setArrayWord(lettersContainer);
    // setArrayWordOriginal(lettersOriginal);
    setWord(lvlWord);
    setlevels(array);
  };
  const classes = useStyles();

  const switchAction = (value) => {
    childRef.current.handleClick(value);
    if (value === "correct" && words[words.length - 1] !== word) {
      nextLevel();
    }
  };
  // const switchActionPrev = (value)=>{
  //   if()
  // }
  const nextLevel = () => {
    setTimeout(() => {
      setchangeLvl(true);
    }, 800);
    let i = levels.indexOf(currentLevel) + 2;
    let changeLvlvar = "nivel" + i;
    httpGetProvin.currentLvl = changeLvlvar;
    // setCurrentLevel(nextLevel)
    getClevel(changeLvlvar);

    forceUpdate();
  };
  const switchActionPrevLvl = () => {
    if (words[0] !== word) {
      previousLevel();
    }
  };
  const previousLevel = () => {
    setTimeout(() => {
      setchangeLvl(true);
    }, 800);
    setchangeLvl(true);
    let i = levels.indexOf(currentLevel);
    let changeLvlvar = "nivel" + i;
    httpGetProvin.currentLvl = changeLvlvar;
    getClevel(changeLvlvar);
    forceUpdate();
  };
  const DragabbleComponent = () => {
    if (arrayWord.length === 0 && !currentLevel) {
      <Typography>Loading...</Typography>;
    } else if (changeLvl) {
      return (
        <div className={classes.root}>
          <Typography className={classes.titleWord}>
            Cargando Nivel...
          </Typography>
          ;
        </div>
      );
    } else if (!changeLvl) {
      return (
        <div style={{ backgroundColor: "#4682B4", minheight: "100vh" }}>
          <AppNavBar />
          <div className={classes.root}>
            <form noValidate autoComplete="off">
              <Typography
                variant="h4"
                component="h4"
                className={classes.titleWord}
              >
                {`Ordena las letras para formar la palabra "${word}"`}
              </Typography>
            </form>
          </div>

          <DraggablePiece
            arrayWord={arrayWord}
            switchAnswer={switchAction}
            previousLevel={switchActionPrevLvl}
          />
          <div className={classes.root}>
            <TransitionsSnackbar ref={childRef} />
          </div>
        </div>
      );
    }
  };
  return <>{DragabbleComponent()}</>;
};
export default React.forwardRef(JigSawInit);
