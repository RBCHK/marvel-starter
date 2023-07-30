import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

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
				this.setState({ characters: response, loading: false });
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: true,
				});
			});
	};

	render() {
		const { characters, loading, error } = this.state;
		const { onCharSelected } = this.props;

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content =
			loading || error || !characters ? null : (
				<View characters={characters} onCharSelected={onCharSelected} />
			);

		return (
			<div className='char__list'>
				{errorMessage}
				{spinner}
				{content}
			</div>
		);
	}
}

const View = ({ characters, onCharSelected }) => {
	return (
		<>
			<ul className='char__grid'>
				{characters.map(character => {
					const imgNotAvailable =
						character.thumbnail ===
						'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
							? { objectFit: 'unset' }
							: { objectFit: 'cover' };

					return (
						<li
							key={character.id}
							className='char__item'
							onClick={() => onCharSelected(character.id)}
						>
							<img
								src={character.thumbnail}
								alt={character.name}
								style={imgNotAvailable}
							/>
							<div className='char__name'>{character.name}</div>
						</li>
					);
				})}
			</ul>
			<button className='button button__main button__long'>
				<div className='inner'>load more</div>
			</button>
		</>
	);
};

export default CharList;
