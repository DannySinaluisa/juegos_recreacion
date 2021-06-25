import React, { useState } from "react";
import { Grid, Button } from "@material-ui/core";
import CanvasDraw from "react-canvas-draw";
import { useHistory } from "react-router-dom";
import AppNavBar from "../../components/navbar";
import { Typography } from "@material-ui/core";
import { useStyles } from "./style";

function Draw2() {
  const classes = useStyles();
  const [canvas] = useState("#4FA1F3 ");
  const [brush] = useState(6);
  const lienzo1 = useState(null);
  const lienzo = useState(null);
  let history = useHistory();

  const draw3 = () => {
    history.push("/draw3");
  };
  const heightResponsive = window.innerHeight < 45 ? 450 : 386  ;

  const clear = () => {
    lienzo.current.clear();
    lienzo1.current.clear();
  };

  return (
    <div style={{ backgroundColor: "#6495ED", height: 850 }}>
      <AppNavBar />

      <Grid container>
        <Grid xs={12} sm={12}>
          <Grid style={{ margin: 8 }}>
            <Grid container>
              <Grid sm={2}>
                <Button
                  onClick={clear}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.btn}
                >
                  Limpiar
                </Button>
              </Grid>
              <Grid style={{ textAlign: "center" }} sm={8}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.titleWord}
              >
                {`Realiza las los circulos y las rayas`}
              </Typography>
              </Grid>
              <Grid sm={2}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={draw3}
                  className={classes.btn}
                  // style={{ width: 100 }}
                >
                  Siguiente
                </Button>
              </Grid>
            </Grid>

            <Grid style={{ textAlign: "center" }}>
              <center>
                <CanvasDraw
                  ref={lienzo1}
                  lazyRadius={1}
                  brushColor={canvas}
                  brushRadius={brush}
                  canvasHeight={heightResponsive}
                  canvasWidth={"65%"}
                  imgSrc="../../images/circulo2.jpg"
                  hideGrid={false}
                  style={{ border: "2px solid #14181C" }}
                />
              </center>
              &nbsp;
            </Grid>
            <Grid style={{ textAlign: "center" }}>
              <center>
                <CanvasDraw
                  ref={lienzo}
                  lazyRadius={1}
                  brushColor={canvas}
                  brushRadius={brush}
                  canvasHeight={heightResponsive}
                  canvasWidth={"65%"}
                  imgSrc="../../images/circulo3.jpg"
                  hideGrid={false}
                  style={{ border: "2px solid #14181C" }}
                />
              </center>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Draw2;
