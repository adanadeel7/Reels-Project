import foodItem from "../models/fooditem.model.js";

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

  const isAlreadyLiked = await likeModel.findOne({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    try {
      await foodItem.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({
        message: "Food unliked successfully",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `Error Found: ${err}`,
      });
    }
  } else {
    try {
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: `Error Found: ${err}`,
      });
    }
  }
}

async function saveFood(req, res) {
  const { foodId } = req.body;

  const user = req.user;

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
  }

  try {
    const save = await saveModel.create({
      user: user._id,
      food: foodId,
    });

    await foodItem.findByIdAndUpdate(foodId, {
      $inc: { savesCount: 1 },
    });

    res.status(201).json({
      message: "Food saved successfully",
      save,
    });
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

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods
    });
} catch(err) { 
    console.log(err);
    return res.status(500).json({
      message: `Error Found: ${err}`,
    });
}
}


export { createFood,getFoodItems,likeFood,saveFood,getSaveFood };
