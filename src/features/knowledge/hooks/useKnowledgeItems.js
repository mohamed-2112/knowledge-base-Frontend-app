import { useEffect, useMemo, useState } from "react";
import { getKnowledgeItems } from "../../../api/knowledgeItems/knowledgeAPI";

export default function useKnowledgeItems() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadKnowledgeItems = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getKnowledgeItems();
            setItems(data);
        } catch (err) {
            console.error("Error fetching knowledge items:", err);
            setError("Failed to load knowledge items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKnowledgeItems();
    }, []);

    const profileItem = useMemo(() => {
        return items.find((item) => item.type?.toUpperCase() === "PROFILE");
    }, [items]);

    const knowledgeItems = useMemo(() => {
        return items.filter((item) => item.type?.toUpperCase() !== "PROFILE");
    }, [items]);

    return {
        items,
        profileItem,
        knowledgeItems,
        loading,
        error,
        refresh: loadKnowledgeItems,
    };
}