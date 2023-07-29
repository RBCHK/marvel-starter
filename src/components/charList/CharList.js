import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {
	state = {
		characters: [],
		loading: true,
		error: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateAllCharacters();
	}

	updateAllCharacters = () => {
		this.marvelService
			.getAllCharacters()
			.then(response => {
				this.setState({ characters: response });
			})
			.catch(() => {
				console.log('error while all characters updating');
				this.setState({
					loading: false,
					error: true,
				});
			});
	};

	render() {
		const { characters } = this.state;

		return (
			<div className='char__list'>
				<ul className='char__grid'>
					{characters.map(character => (
						<li key={character.id} className='char__item'>
							<img src={character.thumbnail} alt={character.name} />
							<div className='char__name'>{character.name}</div>
						</li>
					))}
				</ul>
				<button className='button button__main button__long'>
					<div className='inner'>load more</div>
				</button>
			</div>
		);
	}
}

export default CharList;
