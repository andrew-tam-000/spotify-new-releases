import { ofType } from "redux-observable";
import { mapTo } from "rxjs/operators";
import { createAccessTokenSuccess, getDevicesStart } from "../redux/actions";

export default function onLoginEpic(action$, state$, { firebaseApp }) {
    return action$.pipe(
        ofType(createAccessTokenSuccess().type),
        mapTo(getDevicesStart())
    );
}
