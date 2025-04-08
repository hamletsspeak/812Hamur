import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const DatabaseViewer = ({ path }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Разбиваем путь на коллекцию и документ
        const [collection, documentId, ...rest] = path.split('/');
        
        if (!collection || !documentId) {
            setError('Неверный путь к документу');
            setLoading(false);
            return;
        }

        const docRef = doc(db, collection, documentId);
        
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            if (snapshot.exists()) {
                let data = snapshot.data();
                // Если есть дополнительный путь, получаем вложенные данные
                if (rest.length > 0) {
                    for (const key of rest) {
                        data = data?.[key];
                        if (!data) break;
                    }
                }
                setData(data);
            } else {
                setData(null);
            }
            setLoading(false);
        }, (error) => {
            console.error('Ошибка при получении данных:', error);
            setError(error.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [path]);

    if (loading) return <div>Загрузка данных...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!data) return <div>Данных не найдено</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Данные ({path})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};

export default DatabaseViewer;