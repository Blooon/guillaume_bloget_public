import requestUtils from './request.utils'

export const loadDataIfNeeded = async (componentThis, path, params, returnState) => {
    try {
        if (componentThis[returnState] && componentThis[returnState].lang === params.lang) {
            return;
        }
        if (!componentThis[returnState]) componentThis[returnState] = {}
        componentThis[returnState].loading = true
        componentThis[returnState].lang = params.lang
        const body = await requestUtils.get(path, params);
        componentThis.setState({ [returnState]: body.data});

        componentThis[returnState].loading = false
    }
    catch(err) {
        componentThis.setState({error: err.message});
        console.log(err);
    }
}