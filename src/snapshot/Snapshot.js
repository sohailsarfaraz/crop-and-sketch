import React, { createRef, useState } from "react";
import { useScreenshot } from "use-react-screenshot";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Demo.css";
import { ReactSketchCanvas } from "react-sketch-canvas";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Snapshot = () => {
  const screenRef = createRef(null);
  const canvasRef = createRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(screenRef.current);
  const [open, setOpen] = React.useState(false);

  //For cropping
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState(null);
  const [exportImage, setExportImage] = useState(null);

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  //end For cropping

  //canvas edit
  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };

  //end canvas edit
  const handleClickOpen = () => {
    setOpen(true);
    getImage();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const exportOnClick = () => {
    canvasRef.current
      .exportImage("png")
      .then((data) => {
        console.log(data);
        setExportImage(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <div>
        <button style={{ marginBottom: "10px" }} onClick={handleClickOpen}>
          Take screenshot
        </button>
      </div>

      <Dialog
        // fullScreen={'mx'}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Crop Image
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Cropper
              style={{ height: 400, width: "100%" }}
              zoomTo={0.5}
              initialAspectRatio={1}
              preview=".img-preview"
              src={image}
              viewMode={1}
              minCropBoxHeight={10}
              minCropBoxWidth={10}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
              onInitialized={(instance) => {
                setCropper(instance);
              }}
              guides={true}
            />
            <ReactSketchCanvas
              ref={canvasRef}
              style={styles}
              backgroundImage={cropData}
              width="50%"
              height="50%"
              strokeWidth={4}
              strokeColor="blue"
              exportWithBackgroundImage={true}
              eraseMode={true}
            />

            <img style={{ width: "50%" }} src={exportImage} alt="cropped" />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={getCropData}>Crop</Button>
          <Button onClick={exportOnClick}> Export</Button>
        </DialogActions>
      </Dialog>

      <div ref={screenRef}>
        <h1>use-react-screenshot</h1>
        <p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            distinctio exercitationem a tempore delectus ducimus necessitatibus
            dolor voluptatum aut est quaerat aspernatur, vero quod aperiam odio.
            Exercitationem distinctio in voluptates?
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut
            molestiae deserunt voluptas, labore a expedita error eligendi sunt
            fugit, nesciunt ullam corrupti quas natus, officia rerum? Officia
            cum amet quidem.
          </p>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat,
            iusto repellat quae quos in rerum sunt obcaecati provident placeat
            hic saepe possimus eaque repellendus consequuntur quisquam nihil,
            sit ullam ratione.
          </p>
        </p>
      </div>
    </div>
  );
};

export default Snapshot;
