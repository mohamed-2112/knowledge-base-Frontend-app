import React, { useState } from 'react';
import "../../profile/styles/profile.css";
import "../styles/knowledgeItems.css";
import KnowledgeItemDetails from "./KnowledgeItemDetails";
import { getKnowledgeItemById } from '../../../api/knowledgeItems/knowledgeAPI';
import CreateKnowledgeItemModal from "./CreateKnowledgeItemModal";
import EditKnowledgeItemModal from "./EditKnowledgeItemModal";
import DeleteKnowledgeItemModal from "./DeleteKnowledgeItemModal";


export default function KnowledgeItems({items, loading, error, onItemsChanged}) {
    
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleViewDetails = async (itemId) => {
        try {
            setIsDetailsOpen(true);
            setDetailsLoading(true);
            setDetailsError("");
            setSelectedItem(null);
            const itemDetails = await getKnowledgeItemById(itemId);
            setSelectedItem(itemDetails);
        } catch (err) {
            console.error("Error fetching item details:", err);
            setDetailsError("Failed to load item details. Please try again.");
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedItem(null);
        setDetailsError("");
    };

    const handleEditItem = async (itemId) => {
        try {
        setIsEditOpen(true);
        setEditLoading(true);
        setEditError("");
        setItemToEdit(null);

        const itemDetails = await getKnowledgeItemById(itemId);
        setItemToEdit(itemDetails);
        } catch (error) {
        console.error("Failed to load item for editing:", error);
        setEditError("Failed to load item for editing.");
        } finally {
        setEditLoading(false);
        }
    };

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setItemToEdit(null);
        setEditError("");
    };



    const handleDeleteItem = (item) => {
        setItemToDelete(item);
        setIsDeleteOpen(true);
    };

    const handleCloseDelete = () => {
        setIsDeleteOpen(false);
        setItemToDelete(null);
    };




    return (
        <section className="app-section">
            <div className='knowledge-section-header'>
                <div>
                    <h2 className="section-title">Knowledge Items</h2>
                    <p className="section-description">
                        This section will display your saved knowledge items.
                    </p>
                </div>
                <button
                    type="button"
                    className="btn-app-primary"
                    onClick={() => setIsCreateOpen(true)}
                >
                    Add Knowledge
                </button>
            </div>
            <div className="knowledge-list">
                {loading && (
                    <div className="app-card">
                        <p className="empty-text">Loading knowledge items...</p>
                    </div>
                )}

                {!loading && error && (
                <div className="app-card">
                    <p className="error-text">{error}</p>
                </div>
                )}

                {!loading && !error && items.length === 0 && (
                    <div className="app-card">
                        <p className="empty-text">No knowledge items found. Start adding some!</p>
                        </div>  
                        )}


                {!loading && !error && items.map((item) => (
                    <article className="knowledge-item-card" key={item.id}>
                        <div className="knowledge-item-header">
                            <span className="app-badge">{item.type}</span>
                            <span className="knowledge-date">
                                {formatDate(item.createdAt)}
                            </span>
                        </div>

                        <h3 className="knowledge-title">{item.title}</h3>
                        <p className="knowledge-content">{item.content || "No content provided."}</p>

                        {Array.isArray(item.attributes?.tags) && (
                            <div className="knowledge-tags">
                                {item.attributes.tags.map((tag) => (
                                    <span className="knowledge-tag" key={tag}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="knowledge-card-actions">

                            <button type="button" className="btn-app-outline knowledge-details-button" 
                            onClick={() => handleViewDetails(item.id)}>
                                View Details
                            </button>

                            <button type="button" className="btn-app-outline knowledge-details-button" 
                            onClick={() => handleEditItem(item.id)}>
                                Edit
                            </button>

                            <button
                                type="button"
                                className="btn-app-danger knowledge-details-button"
                                onClick={() => handleDeleteItem(item)}
                            >
                                Delete
                            </button>
                        </div>
                        
                    </article>
                ))}
            </div>

            {isDetailsOpen && (
            <KnowledgeItemDetails 
            item={selectedItem} 
            loading={detailsLoading}
            error={detailsError}
            onClose={handleCloseDetails}
            />
            )}

            <CreateKnowledgeItemModal
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onCreated={onItemsChanged}
            />

            <EditKnowledgeItemModal
            isOpen={isEditOpen}
            item={itemToEdit}
            loading={editLoading}
            error={editError}
            onClose={handleCloseEdit}
            onUpdated={onItemsChanged}
            />

            <DeleteKnowledgeItemModal
            isOpen={isDeleteOpen}
            item={itemToDelete}
            onClose={handleCloseDelete}
            onDeleted={onItemsChanged}
            />

        </section>
    );
}

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }); 
}
