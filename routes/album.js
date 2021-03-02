const express = require("express");
const router = new express.Router();
const AlbumModel = require("./../model/Album");
const ArtistModel = require("./../model/Artist");
const LabelModel = require("./../model/Label");
const uploader = require("./../config/cloudinary");

// router.use(protectAdminRoute);

// GET - all albums
router.get("/", async (req, res, next) => {
  // try {
  //   res.render("dashboard/albums", {
  //     albums: await AlbumModel.find().populate("artist label"),
  //   });
  // } catch (err) {
  //   next(err);
  // }

  AlbumModel.find().populate("artist label")
  .then((albums) => {
    res.render("dashboard/albums", {albums})
    
  })
  .catch(err => next(err))

});

// GET - create one album (form)
router.get("/create", async (req, res, next) => {
  try {
  const artists = await ArtistModel.find();
  const labels = await LabelModel.find();
  res.render("dashboard/albumCreate", { artists, labels })
  } catch (err) {next(err)}

  // ArtistModel.find()
  // .then((artists) => {
  //     LabelModel.find()
  //     .then((labels) => {
  //         res.render("dashboard/albumCreate", {artists, labels})
  //     })
  //   })
  // .catch(err => next(err))


});


// GET - update one album (form)
router.get("/update/:id", async (req, res, next) => {
  try {

    const album = await AlbumModel.findById(req.params.id).populate('artist label');
    const artists = await ArtistModel.find()
    const labels = await LabelModel.find()
    res.render("dashboard/albumUpdate", {album, artists, labels})


  } catch (err) {
    next(err);
  }
});

// GET - delete one album
router.get("/delete/:id", async (req, res, next) => {

  try {
    await AlbumModel.findByIdAndDelete(req.params.id)
    console.log("successfully deleted");
    res.redirect("/dashboard/album");
  } catch (err) {next(err)}

})

// POST - create one album
router.post("/", uploader.single("cover"), async (req, res, next) => {
 
  const newAlbum = { ...req.body };
  if (!req.file) newAlbum.cover = undefined;
  else newAlbum.cover = req.file.path;
  console.log(newAlbum);

  
  try {
    await AlbumModel.create(newAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
});

// POST - update one album

router.post("/:id", uploader.single("cover"), async (req, res, next) => {
 
  const updateAlbum = { ...req.body };
  if (!req.file) updateAlbum.cover = undefined;
  else updateAlbum.cover = req.file.path;
  console.log(updateAlbum);

  
  try {
    await AlbumModel.findByIdAndUpdate(req.params.id, updateAlbum);
    res.redirect("/dashboard/album");
  } catch (err) {
    next(err);
  }
})


module.exports = router;
