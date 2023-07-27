import { Component } from 'react';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import './randomChar.scss';

class RandomChar extends Component {
	constructor(props) {
		super(props);
		this.updateCharacter();
	}

	state = {
		character: {},
		loading: true,
	};

	marvelService = new MarvelService();

	updateCharacter = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);

		this.marvelService.getCharacter(id).then(obj => {
			this.setState({
				character: obj,
				loading: false,
			});
		});
	};

	cutDescription = description => {
		if (description.length > 220) {
			return description.slice(0, 220) + '...';
		}

		return description;
	};

	render() {
		const { character, loading } = this.state;
		const { name, description, thumbnail, homepage, wiki } = character;

		return (
			<div className='randomchar'>
				{loading ? (
					<Spinner />
				) : (
					<div className='randomchar__block'>
						<img src={thumbnail} alt='Random character' className='randomchar__img' />
						<div className='randomchar__info'>
							<p className='randomchar__name'>{name}</p>
							{description ? (
								<p className='randomchar__descr'>
									{this.cutDescription(description)}
								</p>
							) : (
								<p>Ooops.. Description not found</p>
							)}
							<div className='randomchar__btns'>
								<a href={homepage} className='button button__main'>
									<div className='inner'>homepage</div>
								</a>
								<a href={wiki} className='button button__secondary'>
									<div className='inner'>Wiki</div>
								</a>
							</div>
						</div>
					</div>
				)}
				<div className='randomchar__static'>
					<p className='randomchar__title'>
						Random character for today!
						<br />
						Do you want to get to know him better?
					</p>
					<p className='randomchar__title'>Or choose another one</p>
					<button className='button button__main'>
						<div className='inner'>try it</div>
					</button>
					<img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
				</div>
			</div>
		);
	}
}

export default RandomChar;
