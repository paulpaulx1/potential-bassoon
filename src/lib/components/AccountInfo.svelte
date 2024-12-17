<script lang="ts">
    export let user: {
        id: string;
        email: string;
        name: string;
        createdAt: string;
    };

    let newName: string = user.name;
    let isEditing: boolean = false;

    async function updateName() {
        try {
            const res = await fetch(`/api/users`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: user.id, name: newName })
            });

            if (res.ok) {
                user.name = newName;
                isEditing = false;
            } else {
                console.error('Error updating name:', await res.json());
            }
        } catch (err) {
            console.error('Error updating name:', err);
        }
    }
</script>

<div class="account-info">
    <h2>Account Info</h2>
    <div class="info-grid">
        <p><span>Email:</span> {user.email}</p>
        {#if isEditing}
            <div>
                <span>Name:</span>
                <input type="text" bind:value={newName} />
                <button on:click={updateName}>Save</button>
                <button on:click={() => isEditing = false}>Cancel</button>
            </div>
        {:else}
            <p><span>Name:</span> {user.name} <button on:click={() => isEditing = true}>Edit</button></p>
        {/if}
        <p><span>Member since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
</div>
