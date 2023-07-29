import { Component } from 'react';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import './randomChar.scss';

class RandomChar extends Component {
	state = {
		character: {},
		loading: true,
		error: false,
		imgNotFound: true,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateCharacter();
	}

	isImgNotFound = url => url.includes('image_not_available');

	updateCharacter = () => {
		const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
		this.setState({
			loading: true,
		});

		this.marvelService
			.getCharacter(id)
			.then(obj => {
				this.setState({
					character: obj,
					loading: false,
					imgNotFound: this.isImgNotFound(obj.thumbnail),
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: true,
				});
			});
	};

	cutDescription = description => {
		if (description.length > 200) {
			return description.slice(0, 200) + '...';
		}

		return description;
	};

	render() {
		const { character, loading, error, imgNotFound } = this.state;
		const { name, description, thumbnail, homepage, wiki } = character;

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;

		return (
			<div className='randomchar'>
				{errorMessage}
				{spinner}
				{loading || error ? null : (
					<div className='randomchar__block'>
						<img
							src={thumbnail}
							alt='Random character'
							className={imgNotFound ? 'randomchar__imgNotFound' : 'randomchar__img'}
						/>
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
						<div className='inner' onClick={this.updateCharacter}>
							try it
						</div>
					</button>
					<img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
				</div>
			</div>
		);
	}
}

export default RandomChar;
