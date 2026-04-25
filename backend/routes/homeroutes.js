import express from "express";
const router = express.Router();

router.get("/home", (req, res) => {
  try {
    const baseurl = `${req.protocol}://${req.get("host")}`;

    const homedata = {
      topProducts: [
        {
          id: 1,
          title: "Earphones",

          imageUrl: `${baseurl}/images/earbuds.jpg`,
        },
        {
          id: 2,
          title: "smartwatch",
          imageUrl: `${baseurl}/images/smartwatch.jpg`,
        },
        {
          id: 3,
          title: "jwellery",
          imageUrl: `${baseurl}/images/jwellery.jpg`,
        },
        {
          id: 4,
          title: "beautyproducts",
          imageUrl: `${baseurl}/images/beautyproducts.png`,
        },
        {
          id: 5,
          title: "Toys",

          imageUrl: `${baseurl}/images/toys.png`,
        },
        {
          id: 6,
          title: "womenswear",
          imageUrl: `${baseurl}/images/womenswear.jpg`,
        },
        {
          id: 7,
          title: "kidswear",
          imageUrl: `${baseurl}/images/kidswear.jpg`,
        },
        {
          id: 8,
          title: "menswear",
          imageUrl: `${baseurl}/images/menswear.jpg`,
        },
        {
          id: 9,
          title: "sportshoes",

          imageUrl: `${baseurl}/images/sportsshoes.jpg`,
        },
        {
          id: 10,
          title: "videogames",
          imageUrl: `${baseurl}/images/videogame.jpg`,
        },
      ],
      bannerimg: [
        {
          imgurl: `${baseurl}/images/finalbanner.jpg`,
        },
      ],
      popularCards: [
        {
          id: 11,
          title: "womenswear",
          imageUrl: `${baseurl}/images/womenswear.jpg`,
        },
        {
          id: 12,
          title: "kidswear",
          imageUrl: `${baseurl}/images/kidswear.jpg`,
        },
        {
          id: 13,
          title: "menswear",
          imageUrl: `${baseurl}/images/menswear.jpg`,
        },
        {
          id: 14,
          title: "sportshoes",

          imageUrl: `${baseurl}/images/sportsshoes.jpg`,
        },
      ],
      Topbrands: [
        {
          imageUrl: `${baseurl}/images/topbrands2.jpg`,
        },
      ],
    };

    res.status(200).json(homedata);
  } catch (error) {
    console.error("Home Route Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;
