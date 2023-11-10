const {check,validationResult}=require("express-validator")

const hasVenueOrRegistrationLink= (value,{req})=>{
    const venue=req.body.venue;
    const registrationLink = req.body.registrationLink;
    if(!venue && !registrationLink){
        throw new Error('Either Venue or Registration link is required');
    }
    return true
}        


exports.validateEvent=[
    check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Event Title Cannot Be Empty")
    .bail()
    .isLength({min:3,max:20})
    .withMessage('Event Title must be Between 3 to 20 charcter')
    .bail(),
    check('details')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Details Cannot be Empty.")
    .bail()
    .isLength({min:3,max:20})
    .withMessage('Event Details must be Between 3 to 20 charcter')
    .bail(),
    check('on')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Date Cannot be Empty.")
    .bail()
    .isDate()
    .withMessage('Invalid date format')
    .bail(),
    check('venue')
    .custom(hasVenueOrRegistrationLink)
    .bail(),
    (req,res,next)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty())
        return res.status(422).json({errors:errors.array()})
        next();
    }
]

