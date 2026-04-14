function Navbar() {
	const mesAtual = new Date().toLocaleDateString('pt-BR', {
		month: 'long',
		year: 'numeric',
	})

	const totalAVencer = 1840.5

	return (
		<header className="topbar">
			<div>
				<p className="topbar-label">Mes atual</p>
				<h1 className="topbar-title">{mesAtual}</h1>
			</div>

			<div className="topbar-actions">
				<div className="topbar-summary">
					<p className="topbar-label">Total a vencer</p>
					<strong className="topbar-value">
						{totalAVencer.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL',
						})}
					</strong>
				</div>

				<button className="add-bill-button" type="button">
					+ Adicionar conta
				</button>
			</div>
		</header>
	)
}

export default Navbar
