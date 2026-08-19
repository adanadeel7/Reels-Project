import foodItem from "../models/fooditem.model.js";

async function createFood(req, res) {
  const { name, video, description } = req.body;

  if (!name || !video) {
    return res.status(400).json({
      message: "Name and Video URL are required",
    });
  }

  try {
    const food = await fooditem.create({
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
    const foodItems = await fooditem.find({});
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

  const isAlreadyLiked = await likeModel.findone({
    user: user._id,
    food: foodId,
  });

  if (isAlreadyLiked) {
    await likeModel.deleteOne({
      user: user._id,
      food: foodId,
    });

    try {
      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 },
      });

      return res.status(200).json({
        message: "Food unliked successfully",
      });

      const like = await likeModel.create({
        user: user._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 },
      });

      res.status(201).json({
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

export { createFood, getFoodItems,likeFood };
