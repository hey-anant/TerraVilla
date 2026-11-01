import { apiRequest } from '../lib/api';

// Function to fetch all plots
export const getAllPlots = async () => {
    try {
        return await apiRequest('/plots');
    } catch (error) {
        console.error('Error fetching plots:', error);
        return [];
    }
};

// Function to get a plot by ID
export const getPlotById = async (plotId) => {
    try {
        return await apiRequest(`/plots/${plotId}`);
    } catch (error) {
        console.error(`Error fetching plot ${plotId}:`, error);
        return null;
    }
};

// Function to add a new plot (passing as array according to InsForge insert specifications)
export const addNewPlot = async (plotData) => {
    try {
        return await apiRequest('/plots', {
            method: 'POST',
            body: JSON.stringify({
                ...plotData,
                status: 'pending_verification',
                verification_status: 'pending'
            })
        });
    } catch (error) {
        console.error('Error creating plot:', error);
        throw error;
    }
};

export const updatePlotStatus = async (plotId, newStatus) => {
    try {
        return await apiRequest(`/plots/${plotId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus })
        });
    } catch (error) {
        console.error('Error updating plot status:', error);
        throw error;
    }
};

export const setVerificationStatus = async (plotId, newVerificationStatus) => {
    try {
        return await apiRequest(`/plots/${plotId}`, {
            method: 'PATCH',
            body: JSON.stringify({ verification_status: newVerificationStatus })
        });
    } catch (error) {
        console.error('Error setting verification status:', error);
        throw error;
    }
};

export const deletePlot = async (plotId) => {
    try {
        await apiRequest(`/plots/${plotId}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error('Error deleting plot:', error);
        throw error;
    }
};

export const updatePlot = async (plotId, updates) => {
    try {
        return await apiRequest(`/plots/${plotId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    } catch (error) {
        console.error('Error updating plot:', error);
        throw error;
    }
};
