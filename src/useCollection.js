import {useState, useEffect} from 'react'; 
import { db } from './firebase'; 


export default function useCollection(path, orderBy, where=[]){ // custom Hook 
    const [docs, setDocs] = useState([]); 

    const [queryField, queryOperator, queryValue] = where; //where.queryField where.queryOperator etc... 

    useEffect(() => {
        let collection = db.collection(path); 

        if (orderBy) {
            collection = collection.orderBy(orderBy); 
        }
        if(queryField) {
            collection = collection.where(queryField, queryOperator, queryValue); 
        }
        return collection.onSnapshot((snapShot) => { //onSnapshot called anytime contents of collection change 
            const docs = []; 
            snapShot.forEach(doc => {
                docs.push({
                    ...doc.data(),
                    id: doc.id
                });
            });
            setDocs(docs); 
        });
    }, [path, orderBy, queryField, queryOperator, queryValue]); // useEffect will reDo this effect if path or orderBy changes.. this calls setDocs.. state Changes.. and browser rerenders.

    return docs; 
} 

