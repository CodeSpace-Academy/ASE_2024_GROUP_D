"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Pencil, X, Check } from 'lucide-react';

export default function EditableRecipeDetails({ id, initialDescription, lastEditedBy, lastEditedAt }) {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialDescription);
    const [message, setMessage] = useState(null);
    const [editor, setEditor] = useState(lastEditedBy);
    const [editDate, setEditDate] = useState(lastEditedAt);

    const handleEdit = async () => {
        try {
            const response = await fetch(`/api/recipes/${id}/update`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message });
                setEditor(data.lastEditedBy);
                setEditDate(data.lastEditedAt);
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: data.error });
                if (response.status === 401) {
                    setIsEditing(false);
                }
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' });
        }
    };

    const handleCancel = () => {
        setDescription(initialDescription);
        setIsEditing(false);
        setMessage(null);
    };

    return (
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-400">
                    Description
                </h2>
                {!isEditing && (
                    <>
                        {session ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Button>
                        ) : (
                            <Alert variant="destructive" className="mt-2">
                                <AlertTitle>
                                    Authentication Required
                                </AlertTitle>
                                <AlertDescription>
                                    Please log in to edit this recipe.
                                </AlertDescription>
                            </Alert>
                        )}
                    </>
                )}
            </div>

            {isEditing ? (
                <div>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <Check className="h-4 w-4" />
                            Save Changes
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="flex items-center gap-2"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                        {description}
                    </p>
                </div>
            )}

            {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <strong>Last edited by:</strong> {editor || 'Unknown'} on{' '}
                {editDate ? new Date(editDate).toLocaleString() : 'N/A'}
            </p>
        </div>
    );
}
