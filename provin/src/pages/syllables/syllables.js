import React, { useEffect, useState, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { useFourThreeCardMediaStyles } from "@mui-treasury/styles/cardMedia/fourThree";
import { useGridStyles } from "./style";
import { useStyles } from "./style";
import { Button } from "@material-ui/core";
import dataJson from "./data.js";
import useForceUpdate from "use-force-update";
import TransitionsSnackbar from "../dialogNotifications/notification";
import getDataUser from "../../util/get";
import postDataUser from "../../util/post";
import  nofound  from "../../assets/nofound.png";
let colors = [
  "#FFC300",
  "#2ECC71",
  "#BEE37B",
  "#FF5733",
  "#884EA0",
  "#3498DB",
  "#2980B9",
];
const nameLvls = ['Monosílabas', 'Bisílabas']
export const Syllables = React.memo(function SolidGameCard() {
  const [data, setData] = useState(false),
  [dataId, setDataId] = useState(false),
    [level, setLevel] = useState(false),
    [subLevel, setSubLevel] = useState(false),
    [stage, setStage] = useState(false);
  const classes = useStyles();
  const childRef = useRef();
  useEffect(() => {
    getData();

    // setLevel("nivel2");
  }, [!data, !level, !stage, !subLevel]);
  const forceUpdate = useForceUpdate();
  const gridStyles = useGridStyles();
  const styles = useStyles({ color: colors[Math.floor(Math.random() * colors.length)] });

  const getData = async () => {
    const url =
      "http://localhost:4000/stage/6077083499b25a0c64418012/silabas";
    await getDataUser(url).then((response) => {
      const currentSubLvl = response[0] .sub_nivel;
      const currentLvl = response[0].nivel
      
      setDataId(response[0]._id)
      setSubLevel(currentSubLvl);
      setStage('silabas')
      setLevel(currentLvl);
      getContentLvlData(currentSubLvl, currentLvl);
    })

  };
  const getContentLvlData = (lvl, stageCate) => {
    
    setData(dataJson[stageCate][lvl]);
  
  };
  const nextLevel = async(value) => {
    if (value === level) {
      let arr = Object.keys(dataJson[level])
      let lastItem =   Object.keys(dataJson[level]).length-1
      const nxt = subLevel===arr[lastItem]?1:parseInt(subLevel.split("nivel")[1]) + 1;
      const nxtStage = level===nameLvls[nameLvls.length-1]?level:nameLvls[nameLvls.indexOf(level)+1]
      const dataNxtLvl = JSON.stringify({
        _id: dataId,
        nivel: nxt===1?nxtStage:level,
        sub_nivel: subLevel===arr[lastItem]&&level===nameLvls[nameLvls.length-1]?subLevel:`nivel${nxt}`
      })
      if(subLevel===arr[lastItem]&&level===nameLvls[nameLvls.length-1]){
        childRef.current.handleClick('finish');
      }else{
        childRef.current.handleClick('correct');
      }
      
      const url =
      "http://localhost:4000/stage";
      
 
      setTimeout(() => {
        setData(false);
         postDataUser(url,dataNxtLvl).then(response =>{
          if(response){
            getData()
          }
          if(subLevel===arr[lastItem]&&level===nameLvls[nameLvls.length-1]){
            window.location.replace('http://localhost:3000')
          }
        })
      }, 1000);
    }else{
      childRef.current.handleClick('wrong');
    }

  };
  const previousLevel = async() => {
    const url =
    "http://localhost:4000/stage";
    setData(false);
    let arr = Object.keys(dataJson[level])
    let lastItem =   Object.keys(dataJson[level]).length-1
    console.log(lastItem)
    const nxt = subLevel===arr[0]?lastItem+1:parseInt(subLevel.split("nivel")[1]) - 1;
    const nxtStage = level===nameLvls[0]?level:nameLvls[nameLvls.indexOf(level)-1]
    const dataNxtLvl = JSON.stringify({
      _id: dataId,
      nivel: subLevel===arr[0]?nxtStage:level,
      sub_nivel: `nivel${nxt}`
    })
    await postDataUser(url,dataNxtLvl).then(response =>{
      if(response){
        getData()
      }
    })
    
  };

  const CustomCard = ({ classes, image, title, content }) => {
    const mediaStyles = useFourThreeCardMediaStyles();
    if (!data || data === undefined) {
      return <Typography>Cargando...</Typography>;
    } else {
      return (
        <CardActionArea className={classes.actionArea}>
          <Card
            className={data.length < 3 ? classes.card : classes.cardMinSize}  onClick={()=>nextLevel(content)}
          >
            <CardMedia classes={mediaStyles} image={image} />
            <CardContent className={classes.content}>
              <Typography className={classes.titleCard} variant={"h2"}>
                {title}
              </Typography>
            </CardContent>
          </Card>
        </CardActionArea>
      );
    }
  };
  if (!data) {
    return <Typography>Cargando...</Typography>;
  } else {
    return (
      <>
        <Typography className={classes.titleWord}>{`Selecciona la opción correspondiente a ${level}`}</Typography>
        <Grid classes={gridStyles} container spacing={4}>
          {data.map((content) => {
            return (
              <Grid item>
                <CustomCard
                  classes={styles}
                  content={content.category}
                  title={content.title}
                  image={
                    !content.img||content.img===undefined?nofound:content.img
                  }
                 
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <Button
              onClick={()=>{window.location.replace("http://localhost:3000")}}
              variant="contained"
              size="large"
              className={classes.buttonCheck}
            >
              Inicio
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={subLevel === "nivel1" && level==='Monosílabas'}
              onClick={previousLevel}
              variant="contained"
              size="large"
              className={classes.buttonCheck}
            >
              Anterior
            </Button>
          </Grid>
        </Grid>
        <div className={classes.root}>
              <TransitionsSnackbar ref={childRef} />
            </div>
      </>
    );
  }
});
export default Syllables;