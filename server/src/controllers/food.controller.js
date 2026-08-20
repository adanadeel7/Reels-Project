import foodItem from "../models/fooditem.model.js";
import likeModel from "../models/like.model.js";
import saveModel from "../models/save.model.js";

async function createFood(req, res) {
  const { name, video, description } = req.body;

  if (!name || !video) {
    return res.status(400).json({
      message: "Name and Video URL are required",
    });
  }

  try {
    const food = await foodItem.create({
      name,
      video,
      description,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      message: "Successfully Created",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodItem.find({}).populate("foodPartner", "name email");
    res.status(200).json({
      message: "Food items fetched successfully",
      foodItems,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function likeFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  try {
    const isAlreadyLiked = await likeModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodItem.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({
        message: "Food unliked successfully",
      });
    } else {
      const like = await likeModel.create({
        user: user._id,
        food: foodId,
      });

      await foodItem.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 },
      });

      return res.status(201).json({
        message: "Food liked successfully",
        like,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function saveFood(req, res) {
  const { foodId } = req.body;
  const user = req.user;

  try {
    const isAlreadySaved = await saveModel.findOne({
      user: user._id,
      food: foodId,
    });

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        user: user._id,
        food: foodId,
      });

      await foodItem.findByIdAndUpdate(foodId, {
        $inc: { savesCount: -1 },
      });

      return res.status(200).json({
        message: "Food unsaved successfully",
      });
    } else {
      const save = await saveModel.create({
        user: user._id,
        food: foodId,
      });

      await foodItem.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 },
      });

      return res.status(201).json({
        message: "Food saved successfully",
        save,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function getSaveFood(req, res) {
  try {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate('food');
    return res.status(200).json({
      message: "Saved foods retrieved successfully",
      savedFoods: savedFoods || []
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function getPartnerFood(req, res) {
  try {
    const partnerId = req.foodPartner._id;
    const items = await foodItem.find({ foodPartner: partnerId }).populate("foodPartner", "name email");
    return res.status(200).json({
      message: "Partner food items fetched successfully",
      foodItems: items,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
  }
}

async function uploadVideo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }
    const videoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Upload error: ${err.message}` });
  }
}

export { createFood, getFoodItems, likeFood, saveFood, getSaveFood, getPartnerFood, uploadVideo };
