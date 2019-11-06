import {useState, useEffect} from 'react'; 
import {db} from './firebase'; 

const cache = {}; 
const pendingCache = {}; 

export default function useDocWithCache(path){
    const [doc, setDoc] = useState(cache[path]);  
    //console.log('cashe:', cache); 
    //console.log('pendingCashe:', pendingCache); 
    //console.log('doc:', doc);
    useEffect(() => {
        if (doc) {
            return; 
        }
        let stillMounted = true; 
        const pending = pendingCache[path]; 
        const promise = pending || (pendingCache[path] = db
        .doc(path)
        .get()); 
        promise.then(doc => { // don't subscribe to Author/user data with snapShot.. instead just get user (get data once) returns promise. 
            if (stillMounted) { //document still mounted not unmounted yet  
                const user = { // set state of author once. 
                    ...doc.data(), // data from user
                    id: doc.id, 
                }; 
                setDoc(user); 
                cache[path] = user; 
            }
        }); 
        return () => { // don't return a promise from above ^ instead return clean up function. 
            stillMounted = false; 
        }; 
    }, [path, doc]); // if you use a variable/argument value in side effect put inside this array here to clean up 
    return doc;   
}