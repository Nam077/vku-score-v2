import React, { FunctionComponent, useEffect, useState } from 'react';
import { removeAscent } from '../../services/string.service.ts';
import { FileWithPath } from 'react-dropzone';
import CustomDropzone from '../../components/CustomDropzone.tsx';
import TableScore from '../../components/TableScore.tsx';
import { ScoreService } from '../../services/score.service.ts';
import GPAView from '../../components/GPAView.tsx';
import { useNotification } from '../../contexts/Notification.tsx';
import FloatingButton from '../../components/FloatingButton.tsx';
import { Button, FloatButton, Modal, Skeleton } from 'antd';
import TableRecommend from '../../components/TableRecommend.tsx';
import { recommend, recommendLinear } from '../../services/recomend.service.ts';
import { PlusOutlined } from '@ant-design/icons';
import AddScore from '../../components/AddScore.tsx';
import Tutorial from '../../components/Tutorial.tsx';

export interface IScore {
    value: string;
    key?: number | null;
    id: number;
    name: string;
    countTC?: number | null;
    countLH?: number | null;
    scoreCC?: number | null;
    scoreBT?: number | null;
    scoreGK?: number | null;
    scoreCK?: number | null;
    scoreT10?: number | null;
    scoreCh?: string | null;
}

const scoreService = new ScoreService();
const validateData = (scores: IScore[]): IScore[] => {
    return scores.map((score, index) => ({
        ...score,
        key: index + 1,
        id: index + 1,
        value: removeAscent(score.name),
    }));
};

const generateScoreIdUnique = (scores: IScore[]): number => {
    return Math.max(...scores.map((score) => score.id)) + 1;
};

const checkNameExist = (scores: IScore[], name: string): boolean => {
    return scores.some((score) => score.value === name);
};

const readJsonFile = async (file: File) => {
    const fileContent = await file.text();
    return JSON.parse(fileContent);
};

const getScoreFromLocalStorage = (): IScore[] => {
    return JSON.parse(localStorage.getItem('scoreAll') || '[]');
};

const Score: FunctionComponent = () => {
    const { openNotification } = useNotification();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [scoreData, setScoreData] = useState<IScore[]>(getScoreFromLocalStorage);
    const [scoreModified, setScoreModified] = useState<IScore[]>(getScoreFromLocalStorage);
    const [currentGPA, setCurrentGPA] = useState<number>(0);
    const [newGPA, setNewGPA] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAdd, setIsModalAdd] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const showModalAdd = () => setIsModalAdd(true);
    const handleOk = () => setIsModalOpen(false);
    const handleOkAdd = () => setIsModalAdd(false);
    const handleCancel = () => setIsModalOpen(false);
    const handleCancelAdd = () => setIsModalAdd(false);

    const saveToLocalStorage = (data: IScore[]) => {
        localStorage.setItem('scoreAll', JSON.stringify(data));
    };

    const onFilesSelected = async (files: FileWithPath[]) => {
        const file = files[0];
        const res = await readJsonFile(file);
        if (!res.scoreAll) {
            openNotification('File tải lên không đúng!', 'error');
            return;
        }
        setIsLoading(true);
        const scoreUpload = validateData(res.scoreAll);
        setScoreData(scoreUpload);
        setScoreModified(scoreUpload);
        scoreService.setScore(scoreUpload);
        const gpa = scoreService.calcGPA();
        setCurrentGPA(gpa);
        setNewGPA(gpa);
        openNotification('Load dữ liệu thành công !', 'success');
        saveToLocalStorage(scoreUpload);
        setTimeout(() => setIsLoading(false), 1000);
    };

    useEffect(() => {
        scoreService.setScore(scoreModified);
        const gpa = scoreService.calcGPA();
        setNewGPA(gpa);
        if (scoreData.length > 0) {
            openNotification(`GPA đã thay đổi thành ${gpa.toFixed(2)}`, 'success');
        }
    }, [scoreModified]);

    useEffect(() => {
        scoreService.setScore(scoreData);
        const gpa = scoreService.calcGPA();
        setCurrentGPA(gpa);
        setNewGPA(gpa);
    }, [scoreData]);

    useEffect(() => {
        const gpa = scoreService.calcGPA();
        setCurrentGPA(gpa);
        setNewGPA(gpa);
    }, [scoreData, scoreModified]);

    const addScore = (score: IScore) => {
        if (checkNameExist(scoreData, score.value)) {
            openNotification('Học phần đã tồn tại!', 'error');
            return;
        }
        score.id = generateScoreIdUnique(scoreData);
        const updatedScores = [...scoreData, score];
        setScoreData(updatedScores);
        setScoreModified(updatedScores);
        openNotification('Thêm thành công!', 'success');
        saveToLocalStorage(updatedScores);
    };

    const deleteScore = (id: number) => {
        const updatedScores = scoreData.filter((s) => s.id !== id);
        const updatedModifiedScores = scoreModified.filter((s) => s.id !== id);
        setScoreData(updatedScores);
        setScoreModified(updatedModifiedScores);
        openNotification('Xóa học phần thành công!', 'success');
        saveToLocalStorage(updatedScores);
    };

    const updateScoreModified = (score: IScore) => {
        const updatedScores = scoreModified.map((s) => (s.id === score.id ? { ...s, ...score } : s));
        setScoreModified(updatedScores);
        saveToLocalStorage(scoreData);
    };

    return (
        <div>
            <CustomDropzone onFilesSelected={onFilesSelected} />

            <div style={{ marginTop: '10px' }}>
                {scoreData.length > 0 && (
                    <Button onClick={() => {
                        const scoresFromLocalStorage = getScoreFromLocalStorage();
                        setScoreData(scoresFromLocalStorage);
                        setScoreModified(scoresFromLocalStorage);
                    }} type="primary">
                        Load dữ liệu cũ
                    </Button>
                )}
            </div>

            {isLoading ? (
                <Skeleton />
            ) : scoreData.length > 0 ? (
                <div style={{ marginTop: '20px' }}>
                    <GPAView GPA={currentGPA} GPAChange={newGPA} />
                    <TableScore
                        deleteScore={deleteScore}
                        scores={scoreData}
                        changeModified={updateScoreModified}
                        scoreModified={scoreModified}
                    />
                    <FloatingButton onClick={showModal}>Gợi ý cải thiện học phần</FloatingButton>
                    <FloatButton
                        icon={<PlusOutlined />}
                        onClick={showModalAdd}
                        type="primary"
                        tooltip="Thêm học phần"
                        style={{ bottom: 30, left: 30 }}
                    />
                    <Modal
                        title="Gợi ý cải thiện học phần"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        width="77%"
                    >
                        <TableRecommend
                            recommends={recommend(scoreData)}
                            scoreModified={scoreModified}
                            changeModified={updateScoreModified}
                            recommendHocPhan={recommendLinear(scoreData)}
                        />
                    </Modal>
                    <Modal
                        title="Thêm học phần"
                        open={isModalAdd}
                        onOk={handleOkAdd}
                        okButtonProps={{ disabled: true }}
                        onCancel={handleCancelAdd}
                        width={800}
                    >
                        <AddScore addScore={addScore} />
                    </Modal>
                </div>
            ) : (
                <div style={{ marginTop: '40px' }}>
                    <Tutorial />
                </div>
            )}
        </div>
    );
};

export default Score;
