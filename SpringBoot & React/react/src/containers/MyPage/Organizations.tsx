import MyPageStyle from './MyPage.module.scss';
import { OrganizationItem } from 'components/molecules';
import { Error } from 'components/organisms';
import { isEmpty } from 'utils/ArrayUtil';

type OrganizationsProps = {
	data?: Array<Organization>;
}

const Organizations = ({ data } : OrganizationsProps) => {
	if(isEmpty(data)) {
		return <Error title="호스트가 되어 행사를 주최해 보세요" alt="소속된 호스트 없음." titleClassName={MyPageStyle.title} />
	}

	const classMap = new Map<string, string>();
	const styleSheet = new Array<string>();

	data!.forEach(organization => {
		const color = organization.themeColor;
		if(classMap.get(color)) return;

		const className = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5);
		const style = `
			.${className}:hover {
				transition: all 0.4s ease 0s; box-shadow: ${color} 0 0 12px 0;
			}
		`;     

		classMap.set(color, className);
		styleSheet.push(style);
	});

	return (
		<>
			<style>
				{styleSheet.join('\n')}
			</style>

			{data!.map(organization => (
				<OrganizationItem 
					name={organization.name}
					src={organization.profilePath}
					subscribeCount={0}
					to={`/host/${organization.id}`}
					className={classMap.get(organization.themeColor)}
					key={organization.id}/>
			))}
		</>
	);
};

export default Organizations;