import User from '../../models/user-model';
import CustomErrorHandler from '../../errors/CustomErrorHandler';

// wheh next called in auth -> redirects here
const me = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req.user._id}) // from middleware auth
            .select('-password -updatedAt -__v'); // select '-' before fields use to restrict the data to send over
        if (!user) {
            return next(CustomErrorHandler.notFound());
        }
        return res.json(user);
    } catch (err) {
        return next(err);
    }
}

export default me;