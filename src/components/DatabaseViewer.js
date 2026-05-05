import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const DatabaseViewer = ({ path }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Формат path: users/<userId>/<optionalField>
        const [table, rowId, ...rest] = path.split('/');

        if (table !== 'users' || !rowId) {
            setError('Поддерживается только путь users/<id>');
            setLoading(false);
            return;
        }

        let mounted = true;

        const fetchData = async () => {
            const { data: row, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', rowId)
                .maybeSingle();

            if (!mounted) return;
            if (fetchError) {
                setError(fetchError.message);
                setLoading(false);
                return;
            }

            if (row) {
                let resolved = row;
                if (rest.length > 0) {
                    for (const key of rest) {
                        resolved = resolved?.[key];
                        if (!resolved) break;
                    }
                }
                setData(resolved);
            } else {
                setData(null);
            }
            setLoading(false);
        };

        fetchData();

        const channel = supabase
            .channel(`db-viewer-${rowId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'users', filter: `id=eq.${rowId}` },
                () => fetchData()
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
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
