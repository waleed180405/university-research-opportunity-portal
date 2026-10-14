const API_URL = 'http://localhost:3000/api/opportunities';

const opportunitiesList = document.getElementById('opportunitiesList');
const message = document.getElementById('message');
const details = document.getElementById('details');

const createForm = document.getElementById('createForm');
const updateForm = document.getElementById('updateForm');
const loadButton = document.getElementById('loadButton');

function showMessage(text) {
    message.textContent = text;
}

async function loadOpportunities() {
    opportunitiesList.replaceChildren();

    try {
        const response = await fetch(API_URL);
        const opportunities = await response.json();

        if (!response.ok) {
            throw new Error('Could not load opportunities.');
        }

        opportunitiesList.replaceChildren();

        if (opportunities.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.textContent = 'No research opportunities are available.';
            opportunitiesList.appendChild(emptyText);
            return;
        }

        opportunities.forEach(function (opportunity) {
            const card = document.createElement('div');
            card.style.border = '1px solid #d7dfeb';
            card.style.padding = '15px';
            card.style.marginBottom = '15px';
            card.style.borderRadius = '8px';

            const heading = document.createElement('h3');
            heading.textContent = opportunity.title;

            const idText = document.createElement('p');
            idText.textContent = 'Opportunity ID: ' + opportunity.id;

            const statusText = document.createElement('p');
            statusText.textContent = 'Status: ' + opportunity.status;

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'View Details';
            detailsButton.style.marginRight = '8px';

            detailsButton.addEventListener('click', function () {
                showDetails(opportunity.id);
            });

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.marginRight = '8px';

            editButton.addEventListener('click', function () {
                document.getElementById('updateId').value = opportunity.id;
                document.getElementById('updateTitle').value = opportunity.title;
                document.getElementById('updateDescription').value =
                    opportunity.description;

                updateForm.scrollIntoView({ behavior: 'smooth' });
            });

            card.appendChild(heading);
            card.appendChild(idText);
            card.appendChild(statusText);
            card.appendChild(detailsButton);
            card.appendChild(editButton);

            if (opportunity.status === 'Open') {
                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close Opportunity';
                closeButton.style.marginRight = '8px';

                closeButton.addEventListener('click', function () {
                    closeOpportunity(opportunity.id);
                });

                card.appendChild(closeButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.backgroundColor = '#b42318';

            deleteButton.addEventListener('click', function () {
                deleteOpportunity(opportunity.id);
            });

            card.appendChild(deleteButton);
            opportunitiesList.appendChild(card);
        });

    } catch (error) {
        opportunitiesList.replaceChildren();

        const errorText = document.createElement('p');
        errorText.textContent =
            'Could not load opportunities. Check your server connection.';

        opportunitiesList.appendChild(errorText);
        showMessage(error.message);
    }
}

async function showDetails(id) {
    try {
        const response = await fetch(API_URL + '/' + id);
        const opportunity = await response.json();

        if (!response.ok) {
            throw new Error('Opportunity not found.');
        }

        details.replaceChildren();

        const heading = document.createElement('h3');
        heading.textContent = opportunity.title;

        const idText = document.createElement('p');
        idText.textContent = 'Opportunity ID: ' + opportunity.id;

        const descriptionText = document.createElement('p');
        descriptionText.textContent =
            'Description: ' + opportunity.description;

        const statusText = document.createElement('p');
        statusText.textContent = 'Status: ' + opportunity.status;

        const createdText = document.createElement('p');
        createdText.textContent = 'Created At: ' + opportunity.created_at;

        details.appendChild(heading);
        details.appendChild(idText);
        details.appendChild(descriptionText);
        details.appendChild(statusText);
        details.appendChild(createdText);

    } catch (error) {
        showMessage(error.message);
    }
}

createForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const newTitle = document.getElementById('title').value.trim();
    const newDescription =
        document.getElementById('description').value.trim();

    if (newTitle === '' || newDescription === '') {
        showMessage('Please enter both a title and description.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Could not create the opportunity.'
            );
        }

        createForm.reset();
        showMessage('Research opportunity created successfully!');
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message);
    }
});

updateForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const opportunityId = document.getElementById('updateId').value;
    const updatedTitle =
        document.getElementById('updateTitle').value.trim();
    const updatedDescription =
        document.getElementById('updateDescription').value.trim();

    if (
        !opportunityId ||
        Number(opportunityId) < 1 ||
        updatedTitle === '' ||
        updatedDescription === ''
    ) {
        showMessage('Please enter a valid ID, title, and description.');
        return;
    }

    try {
        const response = await fetch(
            API_URL + '/' + opportunityId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    description: updatedDescription
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Could not update the opportunity.'
            );
        }

        updateForm.reset();
        showMessage('Research opportunity updated successfully!');

        await loadOpportunities();
        await showDetails(opportunityId);

    } catch (error) {
        showMessage(error.message);
    }
});

async function closeOpportunity(id) {
    try {
        const response = await fetch(
            API_URL + '/' + id + '/close',
            {
                method: 'PATCH'
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Could not close the opportunity.'
            );
        }

        showMessage('Research opportunity closed successfully!');

        await loadOpportunities();
        await showDetails(id);

    } catch (error) {
        showMessage(error.message);
    }
}

async function deleteOpportunity(id) {
    const confirmed = confirm(
        'Are you sure you want to delete this opportunity?'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(API_URL + '/' + id, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Could not delete the opportunity.'
            );
        }

        showMessage('Research opportunity deleted successfully!');

        details.replaceChildren();

        const text = document.createElement('p');
        text.className = 'muted';
        text.textContent = 'Select an opportunity to view its details.';

        details.appendChild(text);

        await loadOpportunities();

    } catch (error) {
        showMessage(error.message);
    }
}

loadButton.addEventListener('click', loadOpportunities);

loadOpportunities();