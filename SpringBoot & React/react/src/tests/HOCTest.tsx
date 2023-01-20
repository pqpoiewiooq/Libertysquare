import React from 'react';

interface InjectedProps {
    foo: string
}

function withFoo<P extends InjectedProps> (WrappedComponent: React.ComponentType<P>) {
    class WrappingComponent extends React.Component<P> {
        render() {
            return <WrappedComponent foo2="foo_bar" {...this.props} />
        }
    }
    type ExposedProps = Omit<P, keyof InjectedProps> & Partial<InjectedProps>

    return (WrappingComponent as any) as React.ComponentType<ExposedProps>
}



type loadingProps = {
    height: string
    description: string
};

const LoadingProgress = ({height, description} : loadingProps) => {
    return (
        <></>
    );
}

const Input = () => {
    
	return (
        <input>
        </input>
	);
};


interface WithLoadingProps {
    loading: boolean;
    text: string;

}

const withLoading = (loadingMessage = "Loading...") => <P extends object>(Component: React.ComponentType<P>) =>
    class WithLoading extends React.Component<P & WithLoadingProps> {
        render() {
            const { loading, ...props } = this.props;
            return loading ? <LoadingProgress height={"100%"} description={loadingMessage} /> : <Component {...(props as P)} />;
        }
    };

    withLoading("d")(Input);