import foodItem from "../models/fooditem.model.js";
import foodPartner from "../models/foodpartner.model.js";

async function getFoodPartnerById(req,res) { 
    const foodPartnerId = req.params.id 

    try{ 
        const foodPartner = await foodPartner.findById(foodPartnerId)
        const foodItemsByFoodPartner = await foodModel.find({foodPartner : foodPartnerId})
        
        if(!foodPartner) { 
            return res.status(404).json({message : "Food partner not found"})
        }

        res.status(200).json({
            message : " Food Partner Retrieved successfully", 
            foodPartner : { 
                ...foodPartner.toObject(), 
                foodItems: foodItemsByFoodPartner
            }
        })
    
    } catch(err) { 
            console.log(err);
                return res.status(500).json({
                message: `Error Found: ${err}`,
    });

    }
}
export {getFoodPartnerById}